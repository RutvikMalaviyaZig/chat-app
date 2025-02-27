require("dotenv").config();
// core modules
const express = require("express");
const multer = require('multer');
const app = express();
const PORT = process.env.PORT || 3000;

// socket configuration
const http = require('http');
const socketIO = require('socket.io');
const server = http.createServer(app);
const io = socketIO(server);

// routes imports
const apiRoutes = require("./src/routes");
const pageRoutes = require("./src/routes/pageRoute");

// import sequize database
const sequelize = require("./config/database");
const cors = require("cors");

const path = require("path");
const { I18n } = require("i18n");


// multer configuration 
app.use(express.static(path.join(__dirname, 'uploads')));

// storage disk
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({ storage });

// models import
const RoomUser = require("./db/models/roomUser");
const Message = require("./db/models/message");

// controller import
const {
  sendMessageSocket,
  SendMsgToPersonSocket,
} = require("./src/controllers/chatController");


app.use(express.json());
app.set("view engine", "ejs");

// i18n configuration
const i18n = new I18n({
  locales: ["en", "hi", "de"],
  directory: path.join(__dirname, "/config/locales"),
  defaultLocale: "en",
});

app.use(i18n.init);

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
  res.json({ message: res.__("OK") });
});

// routes
app.use("/api/v1", apiRoutes);
app.use("/page", pageRoutes);




// create a map for active user
const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // when connect add user and socket id to map
  const userid = socket.handshake.query.userid;

  if (userid) {
    userSocketMap[userid] = socket.id; // Store userId -> socketId mapping

  }

  // Handle messages of person
  socket.on("sendMessagePersonal", async ({ receiverid, message,  messagetype }) => {
    try {
      console.log('edifewioem') 
      const  userid = socket.handshake.query.userid;
      console.log("useriddddd"+userid)
      const newMessage = await SendMsgToPersonSocket(receiverid, message,userid, messagetype);
      console.log(newMessage)
     
      // find socket id of reciever by recieverid
      // not found null
      console.log(userSocketMap)
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
  socket.on("sendMessagetoRoom", async ({ roomid, message, userid, messagetype }) => {
    try {
      const newMessage = sendMessageSocket(roomid, message, userid, messagetype);

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

// file send
  socket.on("sendFilePersonal", async ({ receiverid, fileUrl, senderid }) => {
    try {
      // Find the socket ID of the receiver
      const receiverSocketId = userSocketMap[receiverid];
  
      if (receiverSocketId) {
        // Emit the file URL to the receiver
        io.to(receiverSocketId).emit("receiveFilePersonal", {
          fileUrl,
          senderid,
        });
      } else {
        console.log(`User ${receiverid} is offline or not connected.`);
      }
    } catch (error) {
      console.error("Error sending file:", error);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete userSocketMap[userid]; // Remove mapping on disconnect
  });
});

server.listen(PORT, (req, res) => {
  console.log(`server is listening at http://localhost:${PORT}`);
});
