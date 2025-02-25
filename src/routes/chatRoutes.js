const express = require("express");
const { test, getOneRoomById, createRoom, joinRoom, leaveRoom, deleteRoom, getAllUser, sendMessage, SendMsgToPerson, getMsgsOfUser, getAllMsgOfRoomId, getAllRoomsByUserId, getAllRoom } = require("../controllers/chatController");
const router = express.Router();

const { verifyAuthMiddleware } = require('../middlewares/verfiyAuthMIddleware')

router.get('/test', test);
router.get("/rooms/userid", getAllRoomsByUserId)
router.get('/rooms', getAllRoom)
router.get("/rooms/one", verifyAuthMiddleware, getOneRoomById)
router.post("/room/create", verifyAuthMiddleware, createRoom)
router.post("/room/join", verifyAuthMiddleware, joinRoom)
router.post('/room/leave', verifyAuthMiddleware, leaveRoom)
router.delete('/room/delete', verifyAuthMiddleware, deleteRoom)

router.post('/room/msg', verifyAuthMiddleware, sendMessage)
router.post('/person/msg', verifyAuthMiddleware, SendMsgToPerson)

router.get('/person/msgs', verifyAuthMiddleware, getMsgsOfUser)
router.get('/room/msgs', verifyAuthMiddleware, getAllMsgOfRoomId)

router.get('/users', getAllUser)


module.exports = router;