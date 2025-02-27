const admin = require("firebase-admin");
const User = require("../../db/models/user");
const serviceAccount = require("../../config/push-notification.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// This helper function is to send push notification to the User
const sendNotification = async (userId, message) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const payload = {
      notification: {
        title: message.title,
        body: message.body,
      },
      token: user.fcmToken,
    };
    const response = await admin.messaging().send(payload);
    console.log("Successfully sent message:", response);
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

module.exports = sendNotification;
