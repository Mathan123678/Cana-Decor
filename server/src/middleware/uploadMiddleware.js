import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// =====================================================
// Directory Setup
// =====================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// server/uploads
const uploadDirectory = path.join(
  __dirname,
  "../../uploads"
);

// Create uploads folder automatically
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });

  console.log(
    "Uploads folder created:",
    uploadDirectory
  );
}

console.log(
  "Upload directory:",
  uploadDirectory
);

// =====================================================
// Multer Storage
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
      `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${extension}`;

    cb(null, filename);
  },
});

// =====================================================
// File Filter
// =====================================================

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG and WEBP images are allowed"
      ),
      false
    );
  }
};

// =====================================================
// Multer
// =====================================================

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;