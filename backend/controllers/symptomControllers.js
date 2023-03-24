const Symptoms = require("../model/symptomModel");

// Get all symptoms
const getSymptoms = async (req, res) => {
  const symptoms = await Symptoms.find();
  res.json(symptoms);
};

// Post category
const setSymptom = async (req, res) => {
  const name = req.body.name;

  try {
    const existingSymptom = await Symptoms.findOne({ name });

    if (existingSymptom) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const newSymptom = new Symptoms({ name });

    await newSymptom.save();

    const symptoms = await Symptoms.find();

    res.json(symptoms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete category
const deleteSymptoms = (req, res) => {
  Symptoms.findByIdAndDelete(req.params.id)
    .then(() => {
      return Symptoms.find();
    })
    .then((symptoms) => {
      res.json(symptoms);
    })
    .catch((err) => res.status(400).json({ error: err }));
};

module.exports = { getSymptoms, setSymptom, deleteSymptoms };
