const Doctor = require("../model/doctorModel");

// get doctor by id
const getDoctor = async (req, res) => {
  const { id } = req.params;
  try {
    const doctor = await Doctor.findOne({ userId: id });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.json(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all doctors
const getDoctors = async (req, res) => {
  const doctors = await Doctor.find();
  res.json(doctors);
};

const updateDoctor = async (req, res) => {
  const id = req.params.id;
  const { name, address, city, province, workPlaceName } = req.body;

  try {
    const doctor = await Doctor.updateOne(
      { userId: id },
      { name, address, city, province, workPlaceName }
    );
    const doctorById = await Doctor.findOne({ userId: id });
    if (!doctorById) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.json(doctorById);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteDoctor = async (req, res) => {
  const id = req.params.id;
  await Doctor.findByIdAndDelete(id)
    .then(() => {
      return Doctor.find();
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = { getDoctor, getDoctors, updateDoctor, deleteDoctor };
