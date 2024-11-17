import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "https://raw.githubusercontent.com/guspan-tanadi/events-api-backend/refs/heads/master/uploads/");
  },
  filename: (req, file, cb) => {/*
    cb(null, `${Date.now()} - ${file.originalname}`);*/
    cb(null, "1731392583682%20-%20hitcJakarta.jpg")
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // batas ukuran file max 2MB,
  },
});

export default upload;
