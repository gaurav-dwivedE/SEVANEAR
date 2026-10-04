export const rupee = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
export const SLOTS = [
  { v: "09:00-12:00", l: "9 AM – 12 PM" },
  { v: "12:00-15:00", l: "12 – 3 PM" },
  { v: "15:00-18:00", l: "3 – 6 PM" },
  { v: "18:00-21:00", l: "6 – 9 PM" },
];
export const slotLabel = (v) => SLOTS.find((s) => s.v === v)?.l || v || "";
export const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }) : "";
export const isoDay = (offset) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};
export const VISIT_FEE = 49;
export const platformFee = (price) => Math.round(price * 0.05);
export const total = (price) => price + VISIT_FEE + platformFee(price);
export const PLACEHOLDER = "/img/placeholder.svg";
export const serviceImages = (s) => (s?.images?.length ? s.images : s?.image ? [s.image] : []);
export const img = (s) => serviceImages(s)[0] || PLACEHOLDER;
export const onImgError = (e) => {
  if (!e.currentTarget.src.endsWith(PLACEHOLDER)) e.currentTarget.src = PLACEHOLDER;
};
