const mongoose = require("mongoose");

const symptomSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a text"],
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Symptoms", symptomSchema);
