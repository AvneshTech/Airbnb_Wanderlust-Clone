// Cloudinary v2 + multer memory storage.
// We intentionally do NOT use `multer-storage-cloudinary`: it peer-depends on the
// legacy cloudinary v1 and breaks ("CloudinaryStorage is not a constructor") on newer
// Node versions. Uploading the buffer directly through the v2 SDK is version-stable.
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Buffer the file in memory so we can stream it to Cloudinary ourselves.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (/^image\/(jpe?g|png)$/.test(file.mimetype)) return cb(null, true);
    cb(new Error("Only JPG, JPEG and PNG images are allowed"));
  },
});

// Uploads a multer file (with .buffer) to Cloudinary, returns { url, filename }.
function uploadImage(file) {
  const b64 = Buffer.from(file.buffer).toString("base64");
  const dataURI = `data:${file.mimetype};base64,${b64}`;
  return cloudinary.uploader
    .upload(dataURI, { folder: "Wanderlust_DEV" })
    .then((res) => ({ url: res.secure_url, filename: res.public_id }));
}

module.exports = { cloudinary, upload, uploadImage };
