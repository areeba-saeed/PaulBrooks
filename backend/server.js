const express = require("express");
const userRoutes = require("./routes/userRoutes");
const { connectDB } = require("./config/db");
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const path = require("path");
const symptomRoutes = require("./routes/symptomRoutes");
const categoryRoutes = require("./routes/categoryRoute");
const medicineRoutes = require("./routes/medicineRoutes");
const user1Routes = require("./routes/user1Routes");
const doctorRoutes = require("./routes/doctorRoutes");
const passport = require("passport");
const { Expo } = require("expo-server-sdk");
const expo = new Expo();

const app = express();
connectDB();
app.use(cors());

app.use(express.static(path.join(__dirname, "assets")));

const imagesDir = path.join(__dirname, "../Website/src/assets/medicine");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Passport middlewares
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);

app.use("/categories", categoryRoutes);
app.use("/symptoms", symptomRoutes);
app.use("/users", userRoutes);
app.use("/medicines", medicineRoutes);
app.use("/user1", user1Routes);
app.use("/doctor", doctorRoutes);
app.get("/images/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(imagesDir, imageName);

  res.sendFile(imagePath, (err) => {
    if (err) {
      console.error(err);
      res.status(404).send("Image not found");
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server Running at ${PORT}`);
});
