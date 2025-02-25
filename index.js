require("dotenv").config();
// core modules
const express = require("express");
// routes imports
const apiRoutes = require("./src/routes");
const pageRoutes = require("./src/routes/pageRoute");
// import sequize database
const sequelize = require("./config/database");
 const cors = require("cors");


// models import 
const RoomUser = require('./db/models/roomUser')
const Message = require('./db/models/message')

const { Server } = require("socket.io");
const { SendMsgToPersonSocket } = require("./src/controllers/chatController");
const io = new Server(3000, {
  cors: { origin: "*" },
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.set('view engine', 'ejs');

// cors setup
// app.use(
//   cors({
//     origin: "*",
//   })
// );
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

// io.on("connection", (socket) => {
//   console.log("A user connected:", socket.id);
//   // when connect add user and socket id to map

//   // Handle messages
//   socket.on("sendMessagePersonal", async ({ receiverid, message, userid }) => {
//     try {
//       // find both users 

//       const newMessage = SendMsgToPersonSocket(receiverid, message, userid);

//       // find socket id of reciever by recieverid 
//       // not found null

//       io.to(receiver-socketid).emit("receiveMessagePersonal", newMessage);
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   });

//   // Handle disconnection
//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);

//     // remove from map
//   });
// });

app.listen(PORT, (req, res) => {
  console.log(`server is listening at http://localhost:${PORT}`);
});
