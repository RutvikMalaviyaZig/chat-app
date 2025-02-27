const admin = require("firebase-admin");
const User = require("../../db/models/user");
const RoomUser = require("../../db/models/roomUser");
const serviceAccount = require("../../config/push-notification.json");
const { DEVICE_TYPE } = require("../../config/constants");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// This helper function is to send push notification to the User
// const sendNotification = async (userId, message) => {
//   try {
//     const user = await User.findOne(userId);
//     if (!user) {
//       throw new Error("User not found");
//     }
//     const payload = {
//       notification: {
//         title: message.title,
//         body: message.body,
//       },
//       token: user.fcmToken,
//     };
//     const response = await admin.messaging().send(payload);
//     console.log("Successfully sent message:", response);
//   } catch (error) {
//     console.error("Error sending message:", error);
//   }
// };


// send notification to person
const sendNotificationPerson = async (receverid, title, body, data) => {
  try {
    let user = await User.findAll({
      where: { id: receverid },
      attributes: ["id", "fcmtoken", "deviceType"],
    });

    const MSG = admin.messaging();

    let androidUserFCMToken = [];
    let iosUserFCMToken = [];
    let webUserFCMToken = [];

    // check for fcmtoken is not null or push token if exist
    user.filter((item) => {
      if (item.fcmtoken !== null && item?.fcmtoken != "") {
        if (item.deviceType == DEVICE_TYPE.ANDROID) {
          androidUserFCMToken.push(item.fcmtoken);
        }
        if (item.deviceType == DEVICE_TYPE.IOS) {
          iosUserFCMToken.push(item.fcmtoken);
        }
        if (item.deviceType == DEVICE_TYPE.WEB) {
          webUserFCMToken.push(item.fcmtoken);
        }
      }
    });

    // payload to sen notification in android
    if (androidUserFCMToken.length > 0) {
      let message = {
        data: {
          title,
          body,
        },
        token: androidUserFCMToken,
      };

      // for additional data
      if (data) {
        message.data = { ...message.data, data };
      }

      // send message to all at once
      MSG.sendEachForMulticast(message)
        .then(async (response) => {
          console.log("Message response : ", response);
        })
        .catch(error);
      console.log("Error sending message:", error);
    }

    // payload to sen notification in ios
    if (iosUserFCMToken.length > 0) {
      let message = {
        data: {
          title,
          body,
        },
        token: iosUserFCMToken,
      };

      // for additional data
      if (data) {
        message.data = { ...message.data, data };
      }
      // send message to all at once
      MSG.sendEachForMulticast(message)
        .then(async (response) => {
          console.log("Message response : ", response);
        })
        .catch(error);
      console.log("Error sending message:", error);
    }

    // payload to sen notification in web
    if (webUserFCMToken.length > 0) {
      let message = {
        data: {
          title,
          body,
        },
        token: webUserFCMToken,
      };

      // for additional data
      if (data) {
        message.data = { ...message.data, data };
      }

      // send message to all at once
      MSG.sendEachForMulticast(message)
        .then(async (response) => {
          console.log("Message response : ", response);
        })
        .catch(error);
      console.log("Error sending message:", error);
    }

    return  data;
  } catch (error) {
    console.log("error  when send message: ", error);
    return  error.message 
  }
};

// send notification in room
const sendNotificationRoom = async (roomid, title, body, data) => {
  try {
    let allUsersInRoom = await RoomUser.findAll({
      where: { roomid },
    });

    const userids = allUsersInRoom.map((item) => item.userid);

    userids.forEach((id) => {
      sendNotificationPerson(id, title, body, data);
    });
  } catch (error) {
    console.log("error  when send message: ", error);
    return  error.message 
  }
};

module.exports = {
  sendNotificationPerson,
  sendNotificationRoom,
};
