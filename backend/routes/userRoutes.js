const express = require("express");
const userRoutes = express.Router();

const {
  deleteUsers,
  getUsers,
  updateUsers,
} = require("../controllers/userControllers");

// Users
userRoutes.route("/").get(getUsers);
userRoutes.route("/:id").delete(deleteUsers);
userRoutes.route("/update/:id").post(updateUsers);

module.exports = userRoutes;
