const express = require("express");
const {
  getUser,
  registerUser,
  loginUser,
  updateUser,
  verifiyOtp,
  resendOtp,
} = require("../controllers/user1controller");
const user1Routes = express.Router();

user1Routes.route("/register").post(registerUser);
user1Routes.route("/login").post(loginUser);
user1Routes.route("/:id").get(getUser).put(updateUser);
user1Routes.route("/verify").post(verifiyOtp);
user1Routes.route("/resend").post(resendOtp);

module.exports = user1Routes;
