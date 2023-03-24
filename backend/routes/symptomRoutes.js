const express = require("express");
const symptomRoutes = express.Router();

const {
  deleteSymptoms,
  getSymptoms,
  setSymptom,
} = require("../controllers/symptomControllers");

// Categories

symptomRoutes.route("/").get(getSymptoms).post(setSymptom);
symptomRoutes.route("/:id").delete(deleteSymptoms);

module.exports = symptomRoutes;
