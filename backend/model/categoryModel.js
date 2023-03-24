const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a text"],
      unique: true,
    },

    image: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Categories", CategorySchema);
