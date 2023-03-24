const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    userId: {
      type: Number,
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
    password: {
      type: String,
      required: true,
    },
    doctor: {
      type: Boolean,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    otp: {
      type: Number,
    },
    otpExpiresAt: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
    },
    deviceToken: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", userSchema);
