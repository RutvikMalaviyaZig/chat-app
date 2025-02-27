const express = require("express");
const { test, getOneRoomById, createRoom, joinRoom, leaveRoom, deleteRoom, getAllUser, sendMessage, SendMsgToPerson, getMsgsOfUser, getAllMsgOfRoomId, getAllRoomsByUserId, getAllRoom, getMe } = require("../controllers/chatController");
const router = express.Router();

const { verifyAuthMiddleware } = require('../middlewares/verfiyAuthMIddleware')

router.use(verifyAuthMiddleware)


router.get('/test', test);
router.get("/rooms/userid", getAllRoomsByUserId)
// router.get('/rooms', getAllRoom)
router.get("/rooms/one",  getOneRoomById)
router.post("/room/create",  createRoom)
router.post("/room/join",  joinRoom)
router.post('/room/leave',  leaveRoom)
router.delete('/room/delete', deleteRoom)

router.post('/room/msg', sendMessage)
router.post('/person/msg', SendMsgToPerson)

router.get('/person/msgs', getMsgsOfUser)
router.get('/room/msgs', getAllMsgOfRoomId)

router.get('/users', getAllUser)
router.get('/me',getMe )

router.post('/fileupload', )

module.exports = router;