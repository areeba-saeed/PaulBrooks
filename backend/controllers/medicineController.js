const Medicines = require("../model/medicineModel");
const User = require("../model/userModel");
const { Expo } = require("expo-server-sdk");
const expo = new Expo();

//   Gell all medicines
const getAllMedicines = async (req, res) => {
  const medicines = await Medicines.find()
    .select(
      "name images description medicineId instructions benefits sideeffects directions featured featuredAt category symptoms ingredients bannerImage"
    )
    .lean();
  res.json(medicines);
};

// Post Medicine
const setMedicine = async (req, res) => {
  const name = req.body.name;
  const description = req.body.description;
  const medicineId = req.body.medicineId;
  const instructions = req.body.instructions;
  const benefits = req.body.benefits;
  const sideeffects = req.body.sideeffects;
  const directions = req.body.directions;
  const category = req.body.category;
  const symptoms = req.body.symptoms;
  const ingredients = req.body.ingredients;
  const images = req.files["images"].map((file) => file.filename);
  const bannerImage = req.files["bannerImage"]
    ? req.files["bannerImage"][0].filename
    : null;
  const newMedicine = new Medicines({
    name,
    images,
    description,
    medicineId,
    instructions,
    benefits,
    sideeffects,
    directions,
    category,
    symptoms,
    ingredients,
    bannerImage,
  });

  newMedicine
    .save()
    // Notification send too
    .then(async () => {
      await Medicines.find()
        .select(
          "name image description medicineId instructions benefits sideeffects directions featured featuredAt category symptoms ingredients bannerImage"
        )
        .lean();
      res.json(newMedicine);
      console.log(bannerImage);
    })
    .catch((err) => res.status(400).json({ error: err }));
};

const deleteMedicine = (req, res) => {
  Medicines.findByIdAndDelete(req.params.id)
    .then((medicine) => {
      const medicines = Medicines.find()
        .select(
          "name images description medicineId instructions benefits sideeffects directions featured featuredAt category symptoms ingredients bannerImage"
        )
        .lean();
      res.json(medicines);
    })
    .catch((error) => {
      res.json(error);
    });
};

const updateMedicine = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedMedicine = {
      name: req.body.name,
      images: req.files["images"].map((file) => file.filename),
      bannerImage: req.files["bannerImage"]
        ? req.files["bannerImage"][0].filename
        : null,
      instructions: req.body.instructions,
      benefits: req.body.benefits,
      sideeffects: req.body.sideeffects,
      directions: req.body.directions,
      category: req.body.category,
      symptoms: req.body.symptoms,
      ingredients: req.body.ingredients,
    };
    const options = { new: true }; // Return the updated document
    const updatedDoc = await Medicines.findByIdAndUpdate(
      id,
      updatedMedicine,
      options
    );
    res.json(updatedDoc);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const medicineById = async (req, res) => {
  const id = req.params.id;
  try {
    const medicine = await Medicines.find({ _id: id })
      .select(
        "name images description medicineId instructions benefits sideeffects directions featured featuredAt category symptoms ingredients bannerImage"
      )
      .lean();

    res.json(medicine);
  } catch (error) {
    res.json(error);
  }
};

const updateFeatured = async (req, res) => {
  const { ids } = req.body;

  try {
    // Extract the IDs from the array of objects
    const idArray = ids.map((item) => item);

    // Find all medicines whose IDs are in the ids array and set their featured property to true
    await Medicines.updateMany(
      { _id: { $in: idArray } },
      { featured: true, featuredAt: Date.now() }
    );

    // Find all other medicines whose IDs are not in the ids array and set their featured property to false
    await Medicines.updateMany({ _id: { $nin: idArray } }, { featured: false });
    const medicinesAll = await Medicines.find();
    res.json(medicinesAll);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getNotification = async (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const users = await User.find();
  const pushTokens = users.map((user) => user.deviceToken);
  console.log(pushTokens);
  const messages = pushTokens.map((pushToken) => ({
    to: pushToken,
    sound: "default",
    title: `${title}`,
    body: `${description}`,
    data: {
      title: `${title}`,
      message: `${description}`,
      customKey: "customValue",
      // Add any other data you want to send to the app
    },
    // Customize the notification appearance
    ios: {
      sound: true,
      badge: true,
      priority: "high",
      channel_id: "my-channel-id",
      data: { foo: "bar" },
      _displayInForeground: true,
      // Add any other customization for iOS
    },
    android: {
      sound: true,
      vibrate: true,
      priority: "high",
      channelId: "my-channel-id",
      data: { foo: "bar" },
      color: "#ff0000",
      icon: "ic_launcher",
      // Add any other customization for Android
    },
  }));

  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];

  const sendNotifications = async () => {
    // Send the chunks of messages
    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error(error);
      }
    }

    // Get the receipt of the sent messages
    const receiptIds = tickets.map((ticket) => ticket.id);
    const receipt = await expo.getPushNotificationReceiptsAsync(receiptIds);

    // Handle the receipt
    for (const [id, status] of Object.entries(receipt)) {
      if (status.status === "error") {
        console.error(
          `There was an error sending a notification with ID ${id}: ${status.message}`
        );
      }
    }
  };

  sendNotifications();
};

module.exports = {
  getAllMedicines,
  setMedicine,
  deleteMedicine,
  updateMedicine,
  medicineById,
  updateFeatured,
  getNotification,
};
