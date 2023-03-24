const express = require("express");
const categoryRoutes = express.Router();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../../Project/Website/src/assets/category");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
let upload = multer({ storage, fileFilter });

const updateCategoryUpload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "../../../Project/Website/src/assets/category");
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      const filename = path.basename(file.originalname, ext);
      cb(null, `${filename}-${uuidv4()}${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

const {
  getCategories,
  deleteCategories,
  updateCategories,
  setCategory,
} = require("../controllers/categoryController");

// categories
categoryRoutes.route("/").get(getCategories);
categoryRoutes.route("/:id").delete(deleteCategories);
categoryRoutes
  .route("/update/:id")
  .post(updateCategoryUpload.single("image"), updateCategories);
categoryRoutes.route("/new").post(upload.single("image"), setCategory);

// Route for accessing uploaded images
categoryRoutes.get("/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.resolve(
    __dirname,
    "../../../Project/Website/src/assets/category",
    imageName
  );
  res.sendFile(imagePath);
});

module.exports = categoryRoutes;
