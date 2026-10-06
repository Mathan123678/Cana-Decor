import multer from "multer";
import path from "path";
import fs from "fs";

// =====================================================
// Upload directory
// =====================================================

const uploadDirectory = path.resolve(
  "uploads",
  "packages"
);

// Create folder automatically
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

// =====================================================
// Storage
// =====================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(
      file.originalname
    );

    const filename =
      `package-${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${extension}`;

    cb(null, filename);
  },
});

// =====================================================
// File Filter
// =====================================================

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only image files are allowed"
      ),
      false
    );
  }
};

// =====================================================
// Multer
// =====================================================

const packageUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default packageUpload;