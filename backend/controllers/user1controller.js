const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const keys = require("../config/db");
const Doctor = require("../model/doctorModel");

const accountSid = "AC19302b1ccd3da4db4973b8e186f571a3";
const authToken = "0ab7972dcfee9f97d000b42afd37e9e7";
const fromNumber = "435";

const twilioClient = require("twilio")(accountSid, authToken);

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ userId: id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const registerUser = async (req, res) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires after 10 minutes
  const userId = req.body.userId;
  const name = req.body.name;
  const phoneNo = req.body.phoneNo;
  const password = req.body.password;
  const password2 = req.body.password2;
  const doctorId = req.body.doctorId;
  const address = req.body.address;
  const city = req.body.city;
  const province = req.body.province;
  const workPlaceName = req.body.workPlaceName;
  const doctor = req.body.doctor;
  const email = req.body.email;
  const deviceToken = req.body.deviceToken;

  try {
    const existingUser = await User.findOne({ phoneNo });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }
    if (!name) {
      return res.status(400).send("Name field required");
    }
    if (!phoneNo) {
      return res.status(400).send("Phone Number field required");
    }
    if (!password) {
      return res.status(400).send("Password field field required");
    }
    if (password !== password2) {
      return res.status(400).json("Password must match");
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json("Password must be at least 8 characters long");
    }

    if (doctor) {
      try {
        const exsitingDoctorEmail = await Doctor.findOne({ email });
        if (exsitingDoctorEmail) {
          return res.status(400).json("Email already exists");
        }

        const newDoctor = new Doctor({
          name,
          userId,
          phoneNo,
          doctorId,
          province,
          city,
          workPlaceName,
          address,
          email,
        });
        await newDoctor.save();
      } catch (error) {
        console.log(error);
      }
    }

    const newUser = new User({
      name,
      userId,
      phoneNo,
      password,
      doctor,
      otp,
      otpExpiresAt,
      isVerified: false,
      deviceToken,
    });

    twilioClient.messages
      .create({
        body: `Your OTP is ${otp}`,
        messagingServiceSid: "MGc1a0f1fb21678e4ade9392ae7b63df5b",
        to: phoneNo, // User's mobile number
      })
      .then((message) => {
        console.log(`SMS sent to ${message.to}: ${message.sid}`);
      })
      .catch((error) => {
        console.error(`Error sending SMS  ${error}`);
      });

    setTimeout(() => {
      newUser.otp = null;

      newUser.save();
    }, 10 * 60 * 1000);

    await newUser.save();
    res.json(newUser);
  } catch (error) {
    console.log(error);
  }
};

const loginUser = async (req, res) => {
  const phoneNo = req.body.phoneNo;
  const password = req.body.password;
  try {
    const user = await User.findOne({ phoneNo });
    if (!user) {
      return res.status(400).send("User not found");
    }
    if (user.isVerified === false) {
      return res.status(400).json({ message: "User not verified", data: user });
    }

    if (password === user.password) {
      const payload = {
        id: user._id,
        name: user.name,
        userId: user.userId, // Add user ID to payload
      };
      jwt.sign(
        payload,
        keys.secretOrKey,
        {
          expiresIn: 31556926, // 1 year in seconds
        },
        (err, token) => {
          if (err) {
            console.log(err);
          } else {
            // Add headers to the response
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader(
              "Access-Control-Allow-Methods",
              "GET, POST, PUT, DELETE"
            );
            res.setHeader(
              "Access-Control-Allow-Headers",
              "Content-Type, Authorization"
            );
            res.json({
              success: true,
              token: "Bearer " + token,
              user: {
                userId: user.userId,
                name: user.name,
                email: user.email,
              },
            });
          }
        }
      );
    } else {
      return res.status(400).send("Incorrect password");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUser = async (req, res) => {
  const id = req.params.id;
  const {
    name,
    oldpassword,
    password,
    address,
    city,
    province,
    workPlaceName,
    doctor,
  } = req.body;

  try {
    const userById = await User.findOne({ userId: id });
    if (oldpassword) {
      if (oldpassword !== userById.password) {
        return res.status(404).send("Current password invalid");
      }
      if (oldpassword === password) {
        return res.status(404).send("New password cannot be old password");
      }
      if (password.length < 8) {
        return res.status(404).send("Password Length must be greater than 8");
      }
    }
    if (doctor) {
      await Doctor.updateOne(
        { userId: id },
        { name, address, city, province, workPlaceName }
      );
    }
    await User.updateOne({ userId: id }, { name, password }, { new: true });
    const userFind = await User.findOne({ userId: id });
    res.json(userFind);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifiyOtp = async (req, res) => {
  const phoneNo = req.body.phoneNo;
  const otp = req.body.otp;
  try {
    const user = await User.find({ phoneNo });
    if (user[0].otp !== otp && user[0].otp !== null) {
      return res.status(404).send("Otp invalid");
    }
    if (user[0].otp !== otp && user[0].otp === null) {
      return res.status(404).send("Otp expired");
    }
    const updatedUser = await User.findOneAndUpdate(
      { phoneNo: phoneNo },
      {
        isVerified: true,
      },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const resendOtp = async (req, res) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires after 10 minutes
  const phoneNo = req.body.phoneNo;
  try {
    const user = await User.findOneAndUpdate(
      { phoneNo: phoneNo },
      {
        otp: otp,
        otpExpiresAt: otpExpiresAt,
      },
      { new: true }
    );
    twilioClient.messages
      .create({
        body: `Your OTP is ${otp}`,
        messagingServiceSid: "MGc1a0f1fb21678e4ade9392ae7b63df5b",
        to: phoneNo, // User's mobile number
      })
      .then((message) => {
        console.log(`SMS sent to ${message.to}: ${message.sid}`);
      })
      .catch((error) => {
        console.error(`Error sending SMS  ${error}`);
      });

    setTimeout(() => {
      user.otp = null;

      user.save();
    }, 10 * 60 * 1000);

    res.json(user.otp);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getUser,
  registerUser,
  loginUser,
  updateUser,
  verifiyOtp,
  resendOtp,
};
