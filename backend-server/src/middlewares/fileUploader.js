// fileUpload.js in middlewares
require("dotenv").config();
const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");
const s3 = require("../config/aws.config").s3;

// 🔽 This function is what you're calling as `userFileUploadMiddleware("events")`
const s3Uploader = (folderName = "others") =>
  multer({
    storage: multerS3({
      s3,
      bucket: process.env.AWS_S3_BUCKET_NAME,
      //   acl: "public-read",
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {
        const ext = path.extname(file.originalname.trim());
        // Preserve the original file name while appending a unique identifier
        const originalName = file.originalname.replace(/\s+/g, "-"); // Replace spaces with dashes (optional, you can customize this)
        const fileName = `${originalName.replace(
          ext,
          ""
        )}-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;

        const fullPath = `${folderName}/${fileName}`;
        cb(null, fullPath); // 🔁 Upload to S3 path like "events/..."
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // max allow 5mb
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/heic" ||
        file.mimetype === "image/heif"
      ) {
        cb(null, true);
      } else {
        cb(new Error("Only jpg, png, jpeg & heic format allowed!"));
      }
    },
  });

module.exports = s3Uploader;
