const mongoose = require("mongoose");
const userModel = require("../model/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

async function registerController(req, res) {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        status: "failed",
        message: "Name, email and password are all required.",
      });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ status: "failed", message: "Password must be at least 6 characters." });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ status: "failed", message: "Enter a valid email address." });
    }

    let user = await userModel.findOne({ email: String(email).toLowerCase().trim() });
    if (user) {
      return res.status(409).json({
        status: "failed",
        message: "Account already exists. Please login.",
      });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    user = await userModel.create({ name: String(name).trim(), email: String(email).toLowerCase().trim(), password: hashedPass });

    res.status(201).json({
      status: "success",
      message: "user registered successfully. Please verify your email",
    });
  } catch (error) {
    console.error("Organization registration error:", error);

    res.status(500).json({
      status: "error",
      message: "An unexpected error occurred. Please try again later.",
    });
  }
}

async function loginController(req, res) {
    try {
        const {email, password} = req.body || {}

        const user = await userModel.findOne({email: String(email || "").toLowerCase().trim()}).select("+password");

        if(!user){
            return res.status(401).json({
                status:"failed",
                message: "Invalid email or password"
            })
        }
        if (user.isBlocked) {
            return res.status(403).json({ status: "failed", code: "BLOCKED", message: "Your account has been blocked. Contact support." });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return res.status(401).json({
                status:"failed",
                message: "Invalid email or password"
            })
        }

        const token = jwt.sign({user: user._id, role: user.role, email: user.email}, process.env.JWT_SECRET, { expiresIn: "24h" });

        res.status(200).json({
            status: "success",
            message: "Login successful",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                pincode: user.pincode,
                city: user.city
            }
        })
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            status: "error",
            message: "An unexpected error occurred. Please try again later.",
        });
    }
}

async function meController(req, res) {
  try {
    const user = await userModel.findById(req.user.user);

    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "User not found.",
      });
    }

    res.status(200).json({
      status: "success",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        pincode: user.pincode,
        city: user.city,
      },
    });
  } catch (error) {
    console.error("Fetch profile error:", error);
    res.status(500).json({
      status: "error",
      message: "An unexpected error occurred. Please try again later.",
    });
  }
}

// Admin: list every registered user.
async function getAllUsersController(req, res) {
  try {
    const users = await userModel.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (error) {
    console.error("Fetch users error:", error);
    res.status(500).json({
      status: "error",
      message: "An unexpected error occurred. Please try again later.",
    });
  }
}


// Logged-in user: save the PIN code (and city) used to filter services.
async function setPincodeController(req, res) {
  try {
    const { pincode, city } = req.body || {};
    if (!/^[1-9][0-9]{5}$/.test(String(pincode || ''))) {
      return res.status(400).json({ status: 'failed', message: 'Enter a valid 6-digit PIN code.' });
    }
    const user = await userModel.findByIdAndUpdate(req.user.user, { pincode, city: city || '' }, { new: true });
    res.status(200).json({ status: 'success', user: { id: user._id, name: user.name, email: user.email, role: user.role, pincode: user.pincode, city: user.city } });
  } catch (error) {
    console.error('Set pincode error:', error);
    res.status(500).json({ status: 'error', message: 'An unexpected error occurred. Please try again later.' });
  }
}

// Admin: block / unblock a customer.
async function blockUserController(req, res) {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).json({ status: 'failed', message: 'User not found.' });
    if (user.role === 'admin') return res.status(400).json({ status: 'failed', message: 'Admin accounts cannot be blocked.' });
    user.isBlocked = !!(req.body || {}).blocked;
    await user.save();
    res.status(200).json({ status: 'success', message: user.isBlocked ? 'User blocked.' : 'User unblocked.', data: user });
  } catch (error) {
    console.error('Block user error:', error);
    res.status(500).json({ status: 'error', message: 'An unexpected error occurred. Please try again later.' });
  }
}

// Admin: permanently delete a customer with their addresses and bookings.
async function deleteUserController(req, res) {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).json({ status: 'failed', message: 'User not found.' });
    if (user.role === 'admin') return res.status(400).json({ status: 'failed', message: 'Admin accounts cannot be deleted.' });
    await Promise.all([
      require('../model/address.model').deleteMany({ user: user._id }),
      require('../model/applications.model').deleteMany({ user: user._id }),
      user.deleteOne(),
    ]);
    res.status(200).json({ status: 'success', message: 'User deleted.' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ status: 'error', message: 'An unexpected error occurred. Please try again later.' });
  }
}

// Admin: one user with their saved addresses and bookings.
async function getUserDetailsController(req, res) {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).json({ status: 'failed', message: 'User not found.' });
    const [addresses, bookings] = await Promise.all([
      require('../model/address.model').find({ user: user._id }).sort({ createdAt: -1 }),
      require('../model/applications.model').find({ user: user._id }).populate('service', 'name').populate('partner', 'name phone').sort({ createdAt: -1 }).limit(50),
    ]);
    res.status(200).json({ status: 'success', data: { user, addresses, bookings } });
  } catch (error) {
    console.error('User details error:', error);
    res.status(500).json({ status: 'error', message: 'An unexpected error occurred. Please try again later.' });
  }
}

module.exports = { getUserDetailsController, registerController, loginController, meController, getAllUsersController, setPincodeController, blockUserController, deleteUserController };
