const mongoose = require("mongoose");

const doctorModel = mongoose.Schema({
  userId: {
    type: Number,
    required: [true, "Please add a text"],
  },
  doctorId: {
    type: Number,
    required: [true, "Please add a text"],
  },
  name: {
    type: String,
    required: [true, "Please add a text"],
  },
  phoneNo: {
    type: String,
    required: [true, "Please add a text"],
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: "String",
  },
  province: {
    type: "String",
  },
  workPlaceName: {
    type: String,
  },
  email:{
    type: String
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Doctors", doctorModel);
