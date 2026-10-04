const partnerApplicationModel = require("../model/partnerApplication.model");
const partnerModel = require("../model/partner.model");
const serviceModel = require("../model/service.model");

// Public: submitted from the "Become a Partner" page, no auth required.
async function createPartnerApplicationController(req, res) {
  try {
    const { name, phone, email, city, pincode, service, experience, message } = req.body || {};

    if (!name || !phone || !city || !service || !/^[1-9][0-9]{5}$/.test(String(pincode || ""))) {
      return res.status(400).json({
        status: "failed",
        message: "Name, phone, city, a valid 6-digit PIN code and service are required.",
      });
    }

    const serviceDoc = await serviceModel.findById(service);
    if (!serviceDoc) {
      return res.status(404).json({
        status: "failed",
        message: "Selected service was not found.",
      });
    }

    const application = await partnerApplicationModel.create({
      name,
      phone,
      email,
      city,
      pincode,
      service,
      experience,
      message: (message || "").trim(),
    });

    res.status(201).json({
      status: "success",
      message: "Application submitted. Our team will reach out to you shortly.",
      data: application,
    });
  } catch (error) {
    console.error("Create partner application error:", error);
    res.status(500).json({
      status: "error",
      message: "An unexpected error occurred. Please try again later.",
    });
  }
}

// Admin: list every partner application.
async function getPartnerApplicationsController(req, res) {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const applications = await partnerApplicationModel
      .find(filter)
      .populate("service", "name startingPrice")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      data: applications,
    });
  } catch (error) {
    console.error("Fetch partner applications error:", error);
    res.status(500).json({
      status: "error",
      message: "An unexpected error occurred. Please try again later.",
    });
  }
}

// Admin: approve or reject. On approval, creates (or updates) a real Partner record.
async function updatePartnerApplicationController(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body || {};

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        status: "failed",
        message: "Status must be pending, approved or rejected.",
      });
    }

    const application = await partnerApplicationModel.findById(id);
    if (!application) {
      return res.status(404).json({
        status: "failed",
        message: "Application not found.",
      });
    }

    application.status = status;
    await application.save();

    let createdPartner = null;
    if (status === "approved") {
      createdPartner = await partnerModel.findOneAndUpdate(
        { phone: application.phone },
        {
          name: application.name,
          phone: application.phone,
          $addToSet: { service: application.service, serviceablePincodes: application.pincode },
          $setOnInsert: { location: { city: application.city, pincode: application.pincode } },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    res.status(200).json({
      status: "success",
      message: "Application updated.",
      data: application,
      partner: createdPartner,
    });
  } catch (error) {
    console.error("Update partner application error:", error);
    res.status(500).json({
      status: "error",
      message: "An unexpected error occurred. Please try again later.",
    });
  }
}

module.exports = {
  createPartnerApplicationController,
  getPartnerApplicationsController,
  updatePartnerApplicationController,
};
