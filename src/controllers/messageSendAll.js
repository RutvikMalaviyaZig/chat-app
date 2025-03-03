const Message = require("../../db/models/message");
const User = require("../../db/models/user");

const sendMessageToAll = async (message) => {
  try {
    const users = await User.findAll();
    console.log(users);
    for (const user of users) {
      await Message.create({ message: message, receiverid: user.id , senderid: "system"});
    }

    // Send message through Socket
    global.io.emit("message", { message: message });
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

module.exports = { sendMessageToAll };
