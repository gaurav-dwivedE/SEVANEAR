const { v2: cloudinary } = require("cloudinary");
const { ok, fail } = require("../utils/availability");

// Configured with a single env var:  CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
// The Cloudinary SDK reads CLOUDINARY_URL automatically.
async function uploadImage(req, res) {
  if (!process.env.CLOUDINARY_URL) {
    return fail(res, "Image uploads are not configured. Set CLOUDINARY_URL in Backend/.env and restart the server.", 503);
  }
  if (!req.file) return fail(res, "Choose an image to upload.");
  cloudinary.config({ secure: true });
  try {
    const folder = req.query.folder === "partners" ? "partners" : "services";
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: `sevanear/${folder}`, resource_type: "image", transformation: [{ width: 1400, height: 1400, crop: "limit", quality: "auto", fetch_format: "auto" }] },
          (err, r) => (err ? reject(err) : resolve(r))
        )
        .end(req.file.buffer);
    });
    ok(res, { url: result.secure_url, publicId: result.public_id });
  } catch (e) {
    console.error("Cloudinary upload error:", e);
    // Admin-only endpoint, so the provider's message (e.g. "Invalid cloud_name") is safe and useful.
    res.status(502).json({ status: "failed", message: `Image upload failed: ${e.message || "Cloudinary rejected the request"}` });
  }
}

module.exports = { uploadImage };
