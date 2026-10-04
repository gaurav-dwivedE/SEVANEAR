const partnerModel = require("../model/partner.model");

// Ids of services that have at least one active partner covering this PIN code.
async function serviceIdsAvailableAt(pincode) {
  return partnerModel.distinct("service", { isActive: true, serviceablePincodes: String(pincode) });
}

async function isServiceAvailableAt(serviceId, pincode) {
  return !!(await partnerModel.exists({
    isActive: true,
    service: serviceId,
    serviceablePincodes: String(pincode),
  }));
}

const ok = (res, data, extra = {}, code = 200) => res.status(code).json({ status: "success", data, ...extra });
const fail = (res, message, code = 400) => res.status(code).json({ status: "failed", message });
const crash = (res, label, error) => {
  console.error(label, error);
  res.status(500).json({ status: "error", message: "An unexpected error occurred. Please try again later." });
};

module.exports = { serviceIdsAvailableAt, isServiceAvailableAt, ok, fail, crash };
