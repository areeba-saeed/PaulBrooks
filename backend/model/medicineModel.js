const mongoose = require("mongoose");

const MedicineSchema = mongoose.Schema(
  {
    medicineId: {
      type: String,
      required: [true, "Please add a text"],
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Please add a text"],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Please add a text"],
    },
    instructions: {
      type: String,
      required: [true, "Please add a text"],
    },
    benefits: {
      type: String,
      required: [true, "Please add a text"],
    },
    sideeffects: {
      type: String,
      required: [true, "Please add a text"],
    },
    directions: {
      type: String,
      required: [true, "Please add a text"],
    },
    category: {
      type: String,
      required: [true, "Please add a text"],
    },
    symptoms: {
      type: Array,
      required: [true, "Please add a text"],
    },
    ingredients: [
      {
        ingredientName: {
          type: String,
        },
        weightage: {
          type: Number,
        },
        measurement: {
          type: String,
        },
      },
    ],
    images: {
      type: [String],
      required: false,
    },
    bannerImage: {
      type: String,
      required: false,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    featuredAt: {
      type: Date,
      default: Date.now,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Medicines", MedicineSchema);
