require("dotenv").config();
// core modules
const express = require("express");
// routes imports
const apiRoutes = require("./src/routes");
const pageRoutes = require("./src/routes/pageRoute");
// import sequize database
const sequelize = require("./config/database");
const cors = require("cors");

const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { Server } = require("socket.io");
const io = new Server(3000, {
  cors: { origin: "*" },
});

// models import
const RoomUser = require("./db/models/roomUser");
const Message = require("./db/models/message");

// controller import
const {
  SendMsgToPerson,
  sendMessage,
} = require("./src/controllers/chatController");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.set("view engine", "ejs");




// test database connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.log("Error: " + err);
  });

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

// routes
app.use("/api/v1", apiRoutes);
app.use("/page", pageRoutes);

// create a map for active user
const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // when connect add user and socket id to map
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id; // Store userId -> socketId mapping
  }

  
  // Handle messages of person
  socket.on("sendMessagePersonal", async ({ receiverid, message, userid }) => {
    try {
      const newMessage = SendMsgToPerson(receiverid, message, userid);

      // find socket id of reciever by recieverid
      // not found null
      const receiverSocketId = userSocketMap[receiverid];

      if (receiverSocketId) {
        // Emit the message to the receiver
        io.to(receiverSocketId).emit("receiveMessagePersonal", newMessage);
      } else {
        console.log(`User ${receiverid} is offline or not connected.`);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });



  // for the room
  socket.on("sendMessagetoRoom", async ({ roomid, message, userid }) => {
    try {
      const newMessage = sendMessage(roomid, message, userid);

      // find socket id of room using roomid
      // not found null
      const roomSocketId = userSocketMap[roomid];

      if (roomSocketId) {
        // Emit the message to the receiver
        io.to(roomSocketId).emit("receiveMessageroom", newMessage);
      } else {
        console.log(`User ${roomid} is offline or not connected.`);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });


  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete userSocketMap[userId]; // Remove mapping on disconnect
  });
});

app.listen(PORT, (req, res) => {
  console.log(`server is listening at http://localhost:${PORT}`);
});
