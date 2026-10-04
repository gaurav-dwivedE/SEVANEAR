const applicationModel = require("../model/applications.model");
const serviceModel = require("../model/service.model");
const addressModel = require("../model/address.model");
const { buildPricing, toInvoice } = require("../utils/pricing");
const { isServiceAvailableAt } = require("../utils/availability");
const userModel = require("../model/user.model");
const { STATUSES } = require("../model/applications.model");
const SLOTS = ["09:00-12:00", "12:00-15:00", "15:00-18:00", "18:00-21:00"];

async function createApplicationController(req, res) {
  try {
    const { service, selectedAddress, additionalDetails, scheduledDate, timeSlot } = req.body || {};

    if (!service || !selectedAddress) {
      return res.status(400).json({
        status: "failed",
        message: "Please select a service and an address.",
      });
    }

    const serviceDoc = await serviceModel.findById(service);
    if (!serviceDoc) {
      return res.status(404).json({
        status: "failed",
        message: "Selected service was not found.",
      });
    }

    const addressDoc = await addressModel.findOne({
      _id: selectedAddress,
      user: req.user.user,
    });
    if (!addressDoc) {
      return res.status(404).json({
        status: "failed",
        message: "Selected address was not found.",
      });
    }

    if (!(await isServiceAvailableAt(serviceDoc._id, addressDoc.zipCode))) {
      return res.status(400).json({
        status: "failed",
        message: `${serviceDoc.name} is not available at PIN code ${addressDoc.zipCode} yet. Choose another address.`,
      });
    }

    if (!scheduledDate || !SLOTS.includes(timeSlot)) {
      return res.status(400).json({ status: "failed", message: "Please choose a date and time slot." });
    }
    const when = new Date(scheduledDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (Number.isNaN(when.getTime()) || when < today) {
      return res.status(400).json({ status: "failed", message: "Please choose a date today or later." });
    }
    const open = await applicationModel.countDocuments({
      user: req.user.user,
      status: { $in: ["pending", "approved", "in_progress"] },
    });
    if (open >= 10) {
      return res.status(429).json({ status: "failed", message: "You have too many open bookings." });
    }

    const application = await applicationModel.create({
      user: req.user.user,
      scheduledDate: when,
      timeSlot,
      priceEstimate: buildPricing(serviceDoc.startingPrice).total,
      pricing: buildPricing(serviceDoc.startingPrice),
      service,
      selectedAddress,
      additionalDetails: String(additionalDetails || "").trim().slice(0, 1000),
    });

    res.status(201).json({
      status: "success",
      message: "Application submitted successfully.",
      data: application,
    });
  } catch (error) {
    console.error("Create application error:", error);
    res.status(500).json({
      status: "error",
      message: "An unexpected error occurred. Please try again later.",
    });
  }
}

async function getMyApplicationsController(req, res) {
  try {
    const applications = await applicationModel
      .find({ user: req.user.user, deletedByUser: { $ne: true } })
      .populate("service", "name description startingPrice image category")
      .populate("selectedAddress")
      .populate("partner", "name phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      data: applications,
    });
  } catch (error) {
    console.error("Fetch applications error:", error);
    res.status(500).json({
      status: "error",
      message: "An unexpected error occurred. Please try again later.",
    });
  }
}

// Admin: list applications. Query: status, service, from, to (YYYY-MM-DD, on scheduled date), q (customer / service text).
async function getAllApplicationsController(req, res) {
  try {
    const { status, service, from, to, q, cancelledBy } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (service) filter.service = service;
    if (["user", "admin"].includes(cancelledBy)) filter.cancelledBy = cancelledBy;
    if (from || to) {
      filter.scheduledDate = {};
      if (from) filter.scheduledDate.$gte = new Date(from);
      if (to) filter.scheduledDate.$lte = new Date(new Date(to).setHours(23, 59, 59, 999));
    }

    let applications = await applicationModel
      .find(filter)
      .populate("user", "name email pincode city createdAt")
      .populate("service", "name startingPrice image")
      .populate("selectedAddress")
      .populate("partner", "name phone")
      .sort({ scheduledDate: -1, createdAt: -1 })
      .limit(500);

    if (q) {
      const t = String(q).toLowerCase();
      applications = applications.filter((a) =>
        [a.user?.name, a.user?.email, a.service?.name, a.selectedAddress?.zipCode, a.selectedAddress?.mobile]
          .filter(Boolean).some((v) => String(v).toLowerCase().includes(t))
      );
    }
    res.status(200).json({ status: "success", data: applications });
  } catch (error) {
    console.error("Fetch all applications error:", error);
    res.status(500).json({ status: "error", message: "An unexpected error occurred. Please try again later." });
  }
}

// Admin: delete a booking record.
async function deleteApplicationController(req, res) {
  try {
    const a = await applicationModel.findByIdAndDelete(req.params.id);
    if (!a) return res.status(404).json({ status: "failed", message: "Booking not found." });
    res.status(200).json({ status: "success", message: "Booking deleted." });
  } catch (error) {
    console.error("Delete application error:", error);
    res.status(500).json({ status: "error", message: "An unexpected error occurred. Please try again later." });
  }
}

// Admin: update status and/or assign a partner to an application.
async function updateApplicationController(req, res) {
  try {
    const { id } = req.params;
    const { status, partner, adjustments, paymentStatus } = req.body || {};

    const update = {};
    if (status) {
      if (!STATUSES.includes(status)) {
        return res.status(400).json({
          status: "failed",
          message: `Status must be one of: ${STATUSES.join(", ")}.`,
        });
      }
      update.status = status;
      const cur = await applicationModel.findById(id).select("status");
      if (status === "cancelled" && cur && cur.status !== "cancelled") {
        update.cancelledBy = "admin";
        update.cancelledAt = new Date();
      } else if (status !== "cancelled") {
        update.$unset = { cancelledBy: 1, cancelledAt: 1, cancelReason: 1 };
      }
    }
    if (partner) update.partner = partner;
    if (Array.isArray(adjustments)) {
      const clean = adjustments
        .map((a) => ({ label: String(a.label || "").trim().slice(0, 80), amount: Math.round(Number(a.amount)) }))
        .filter((a) => a.label && Number.isFinite(a.amount) && a.amount !== 0);
      update.adjustments = clean;
    }
    if (paymentStatus) {
      if (!["unpaid", "paid"].includes(paymentStatus)) {
        return res.status(400).json({ status: "failed", message: "Payment status must be paid or unpaid." });
      }
      update.paymentStatus = paymentStatus;
      update.paidAt = paymentStatus === "paid" ? new Date() : null;
    }

    const application = await applicationModel
      .findByIdAndUpdate(id, update, { new: true })
      .populate("user", "name email pincode city createdAt")
      .populate("service", "name description startingPrice image category")
      .populate("selectedAddress")
      .populate("partner", "name phone");

    if (!application) {
      return res.status(404).json({
        status: "failed",
        message: "Application not found.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Application updated.",
      data: application,
    });
  } catch (error) {
    console.error("Update application error:", error);
    res.status(500).json({
      status: "error",
      message: "An unexpected error occurred. Please try again later.",
    });
  }
}

// User: cancel own booking while it hasn't started.
const CANCEL_REASONS = {
  changed_plans: "My plans changed",
  schedule: "I need a different date or time",
  other_provider: "I found another provider",
  price: "The price is higher than I expected",
  mistake: "I booked by mistake or with wrong details",
  other: "Other",
};

async function cancelApplicationController(req, res) {
  try {
    const { reason, note } = req.body || {};
    if (!CANCEL_REASONS[reason]) {
      return res.status(400).json({ status: "failed", message: "Please select a reason for cancelling." });
    }
    const text = String(note || "").trim().slice(0, 200);
    if (reason === "other" && text.length < 3) {
      return res.status(400).json({ status: "failed", message: "Please tell us the reason." });
    }
    const app = await applicationModel.findOne({ _id: req.params.id, user: req.user.user });
    if (!app) return res.status(404).json({ status: "failed", message: "Booking not found." });
    if (!["pending", "approved"].includes(app.status)) {
      return res.status(400).json({ status: "failed", message: "This booking can no longer be cancelled." });
    }
    app.status = "cancelled";
    app.cancelledBy = "user";
    app.cancelledAt = new Date();
    app.cancelReason = reason === "other" ? `Other: ${text}` : CANCEL_REASONS[reason] + (text ? ` (${text})` : "");
    await app.save();
    res.status(200).json({ status: "success", message: "Booking cancelled.", data: app });
  } catch (error) {
    console.error("Cancel application error:", error);
    res.status(500).json({ status: "error", message: "An unexpected error occurred. Please try again later." });
  }
}

// User: remove a finished booking from their list (kept for the admin and for public reviews).
async function deleteMyApplicationController(req, res) {
  try {
    const app = await applicationModel.findOne({ _id: req.params.id, user: req.user.user, deletedByUser: { $ne: true } });
    if (!app) return res.status(404).json({ status: "failed", message: "Booking not found." });
    if (!["completed", "cancelled", "rejected"].includes(app.status)) {
      return res.status(400).json({ status: "failed", message: "Cancel an active booking before deleting it." });
    }
    app.deletedByUser = true;
    await app.save();
    res.status(200).json({ status: "success", message: "Booking deleted." });
  } catch (error) {
    console.error("Delete my application error:", error);
    res.status(500).json({ status: "error", message: "An unexpected error occurred. Please try again later." });
  }
}

// User: rate a completed booking (updates the service's running average).
async function reviewApplicationController(req, res) {
  try {
    const rating = Number((req.body || {}).rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ status: "failed", message: "Rating must be 1 to 5." });
    }
    const app = await applicationModel.findOne({ _id: req.params.id, user: req.user.user });
    if (!app) return res.status(404).json({ status: "failed", message: "Booking not found." });
    if (app.status !== "completed") {
      return res.status(400).json({ status: "failed", message: "Only completed bookings can be reviewed." });
    }
    const previous = app.rating || 0;
    app.rating = rating;
    app.review = String((req.body || {}).review || "").trim().slice(0, 600);
    await app.save();
    const svc = await serviceModel.findById(app.service);
    if (svc) {
      if (previous) {
        // Editing: replace the old rating in the running average.
        svc.ratingAvg = svc.ratingCount ? (svc.ratingAvg * svc.ratingCount - previous + rating) / svc.ratingCount : rating;
      } else {
        svc.ratingAvg = (svc.ratingAvg * svc.ratingCount + rating) / (svc.ratingCount + 1);
        svc.ratingCount += 1;
      }
      await svc.save();
    }
    res.status(200).json({ status: "success", message: previous ? "Review updated." : "Thanks for your review!", data: app });
  } catch (error) {
    console.error("Review error:", error);
    res.status(500).json({ status: "error", message: "An unexpected error occurred. Please try again later." });
  }
}

// Owner (or admin): one booking with invoice totals.
async function getApplicationController(req, res) {
  try {
    const filter = { _id: req.params.id };
    if (req.user.role !== "admin") { filter.user = req.user.user; filter.deletedByUser = { $ne: true }; }
    const app = await applicationModel
      .findOne(filter)
      .populate("user", "name email")
      .populate("service", "name description startingPrice image")
      .populate("selectedAddress")
      .populate("partner", "name phone");
    if (!app) return res.status(404).json({ status: "failed", message: "Booking not found." });
    res.status(200).json({ status: "success", data: toInvoice(app) });
  } catch (error) {
    console.error("Get application error:", error);
    res.status(500).json({ status: "error", message: "An unexpected error occurred. Please try again later." });
  }
}

module.exports = {
  deleteMyApplicationController,
  getApplicationController,
  deleteApplicationController,
  cancelApplicationController,
  reviewApplicationController,
  createApplicationController,
  getMyApplicationsController,
  getAllApplicationsController,
  updateApplicationController,
};
