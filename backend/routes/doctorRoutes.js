const express = require("express");
const {
  getDoctors,
  getDoctor,
  updateDoctor,
  deleteDoctor,
} = require("../controllers/doctorController");
const doctorRoutes = express.Router();

doctorRoutes.route("/").get(getDoctors);
doctorRoutes
  .route("/:id")
  .get(getDoctor)
  .put(updateDoctor)
  .delete(deleteDoctor);

module.exports = doctorRoutes;
