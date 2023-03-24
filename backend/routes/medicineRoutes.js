const express = require("express");
const {
  getAllMedicines,
  setMedicine,
  deleteMedicine,
  updateMedicine,
  medicineById,
  updateFeatured,
  getNotification,
} = require("../controllers/medicineController");
const medicineRoutes = express.Router();
const multer = require("multer");
const path = require("path");
const Medicines = require("../model/medicineModel");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../../Project/Website/src/assets/medicine");
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

const upload = multer({
  storage,
  fileFilter,
}).fields([
  { name: "bannerImage", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);
medicineRoutes.route("/").get(getAllMedicines);
medicineRoutes.route("/:id").get(medicineById);
medicineRoutes.route("/featured").put(updateFeatured);
medicineRoutes.route("/new").post(upload, setMedicine);
medicineRoutes.route("/delete/:id").delete(deleteMedicine);
medicineRoutes.route("/update/:id").post(upload, updateMedicine);
medicineRoutes.route("/notification").post(getNotification);

// Route for accessing uploaded images
medicineRoutes.get("/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.resolve(
    __dirname,
    "../../../Project/Website/src/assets/medicine",
    imageName
  );
  console.log(JSON.stringify(2));
  res.sendFile(JSON.stringify(imagePath));
});

module.exports = medicineRoutes;
