// Pricing rules. Keep in sync with Frontend/src/lib/format.js (display only).
const VISIT_FEE = 49;
const PLATFORM_RATE = 0.05;

function buildPricing(servicePrice) {
  const price = Number(servicePrice) || 0;
  const platformFee = Math.round(price * PLATFORM_RATE);
  return { servicePrice: price, visitFee: VISIT_FEE, platformFee, total: price + VISIT_FEE + platformFee };
}

// Adds invoice totals to a booking (works for older bookings saved without pricing).
function toInvoice(app) {
  const o = app.toObject ? app.toObject() : app;
  const base = o.pricing?.total ? o.pricing : buildPricing(o.service?.startingPrice);
  const adjustments = (o.adjustments || []).map((a) => ({ label: a.label, amount: a.amount }));
  const extra = adjustments.reduce((s, a) => s + a.amount, 0);
  return {
    ...o,
    invoice: {
      number: `SN-${String(o._id).slice(-8).toUpperCase()}`,
      pricing: base,
      adjustments,
      total: base.total + extra,
      isFinal: o.status === "completed",
      paymentStatus: o.paymentStatus || "unpaid",
      paidAt: o.paidAt || null,
    },
  };
}

module.exports = { buildPricing, toInvoice, VISIT_FEE };
