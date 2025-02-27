const Message = require("../../db/models/message");
const Room = require("../../db/models/room");
const RoomUser = require("../../db/models/roomUser");
const User = require("../../db/models/user");
const { Op } = require("sequelize");

const MESSAGES = require("../utils/Messages");
const HTTP_STATUS_CODE = require("../utils/HttpStatusCodes");

const test = (req, res) => {
  return res.json({ message: "Hello World" });
};

/**
 * @function getMe
 * @description get user details
 * @param {Request} req
 * @param {Response} res
 * @returns {object} - give details of login user
 */
const getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    // get user info using userid
    const userInfo = await User.findOne({ where: { id: userId } });
    // if no user then give message pls signup/login
    if (!userInfo) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        errorCode: "",
        message: MESSAGES.PLZ_SIGNUP_LOGIN,
        data: "",
        error: "",
      });
    }
    // send user details
    return res.status(HTTP_STATUS_CODE.OK).json({
      status: HTTP_STATUS_CODE.OK,
      errorCode: "",
      message: MESSAGES.USER_DETAILS,
      data: userInfo,
      error: "",
    });
  } catch (error) {
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
      errorCode: "",
      message: error.message,
      data: "",
      error: "",
    });
  }
};

/**
 * @function getAllRoomsByUserId
 * @description get all room using userid
 * @param {Request} req
 * @param {Response} res
 * @returns {object} - give list of all room of given userid
 */
const getAllRoomsByUserId = async (req, res) => {
  // find rooms with login user id
  // send to response

  try {
    // get userid from the middleware token
    const userid = req.user.id;
    if (!userid) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        errorCode: "",
        message: MESSAGES.ALL_FIELDS_REQUIRED,
        data: "",
        error: "",
      });
    }
    // checkuser in database
    const chekUserinDb = await User.findOne({ where: { id: userid } });
    if (!chekUserinDb) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        errorCode: "",
        message: MESSAGES.PLZ_SIGNUP_LOGIN,
        data: "",
        error: "",
      });
    }
    // get all room where user join
    const allRoomsJoin = await RoomUser.findAll({ where: { userid: userid } });
    if (!allRoomsJoin) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        errorCode: "",
        message: MESSAGES.YOU_HAVE_NO_ROOM,
        data: "",
        error: "",
      });
    }
    // get all roomid as array for find room in room model
    const roomIds = allRoomsJoin.map((item) => item.roomid);

    // get all room from the room model using all roomid
    const rooms = await Room.findAll({
      where: {
        id: {
          [Op.in]: roomIds,
        },
      },
    });

    // get all rooms which is created by user
    const allRoomByCreate = await Room.findAll({
      where: { creatorid: userid },
    });

    // combine all rooom and send it in response
    const combinedResponse = {
      roomsByJoindIds: rooms, // Rooms from roomIds
      roomsByCreator: allRoomByCreate, // Rooms created by the specified user
    };

    return res.status(HTTP_STATUS_CODE.OK).json({
      status: HTTP_STATUS_CODE.OK,
      errorCode: "",
      message: MESSAGES.GET_ALL_ROOM_WITH_ID,
      data: "",
      error: "",
      rooms: combinedResponse,
    });
  } catch (error) {
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
      errorCode: "",
      message: error.message,
      data: "",
      error: "",
    });
  }
};

/**
 * @function getAllRoom
 * @description get all room
 * @param {Request} req
 * @param {Response} res
 * @returns {object} - give list of all room
 */
const getAllRoom = async (req, res) => {
  try {
    const AllRooms = await Room.findAll();
    return res.status(HTTP_STATUS_CODE.OK).json({
      status: HTTP_STATUS_CODE.OK,
      errorCode: "",
      message: MESSAGES.GET_ALL_ROOMS,
      data: "",
      error: "",
      rooms: AllRooms,
    });
  } catch (error) {
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
      errorCode: "",
      message: error.message,
      data: "",
      error: "",
    });
  }
};

/**
 * @function getOneRoomById
 * @description Get one room by id
 * @param {object} req - request object
 * @param {string} req.user.Id - userid
 * @returns {object} - send room details
 */
const getOneRoomById = async (req, res) => {
  // find room with roomid
  // check req.user id and room users - exists
  // send room

  try {
    // take userid and roomid
    const { roomid } = req.body;
    const userId = req.user.id;
    // check both is present or not
    if (!roomid || !userId) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        errorCode: "",
        message: MESSAGES.ALL_FIELDS_REQUIRED,
        data: "",
        error: "",
      });
    }
    // check user is in room or not
    const checkUserinRoomUser = await RoomUser.findOne({
      where: { userid: userId },
    });
    if (!checkUserinRoomUser) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        errorCode: "",
        message: MESSAGES.NOT_PART_OF_ROOM,
        data: "",
        error: "",
      });
    }
    // find room with roomid and userid and send it into response
    const roomfind = await RoomUser.findOne({
      where: { roomid: roomid, userid: userId },
    });
    if (!roomfind) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        errorCode: "",
        message: MESSAGES.ROOM_NOT_FOUND,
        data: "",
        error: "",
      });
    }

    return res.status(HTTP_STATUS_CODE.OK).json({
      status: HTTP_STATUS_CODE.OK,
      errorCode: "",
      message: MESSAGES.ROOM_GET_SUCCESS,
      data: "",
      error: "",
      room: roomfind,
    });
  } catch (error) {
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
      errorCode: "",
      message: error.message,
      data: "",
      error: "",
    });
  }
};

// create room
// req.user
/**
 * @function createRoom
 * @description create room using name of room
 * @param {object} req - request object
 * @param {string} req.body.name - room name
 * @returns {object} - roomid ,creatorid and room name
 */
const createRoom = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;
    // check both is present or not
    if (!name || !userId) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        errorCode: "",
        message: MESSAGES.ALL_FIELDS_REQUIRED,
        data: "",
        error: "",
      });
    }
    // create room using name and userid
    const createRoom = await Room.create({ name: name, creatorid: userId });

    // add this room user into roomUser table
    await RoomUser.findOrCreate({
      where: {
        roomid: createRoom.id,
        userid: userId,
      },
    });

    return res.status(HTTP_STATUS_CODE.CREATED).json({
      status: HTTP_STATUS_CODE.CREATED,
      errorCode: "",
      message: MESSAGES.CREATE_ROOM,
      error: "",
      data: createRoom,
    });
  } catch (error) {
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
      errorCode: "",
      message: error.message,
      data: "",
      error: "",
    });
  }
};

/**
 * @function joinRoom
 * @description join room using roomid
 * @param {object} req - request object
 * @param {string} req.body.id - roomid
 * @returns {object} - join room successfully
 */
// join room

const joinRoom = async (req, res) => {
  try {
    const { roomid } = req.body;
    const userid = req.user.id;
    // check both is given or not
    if (!roomid || !userid) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        errorCode: "",
        message: MESSAGES.ALL_FIELDS_REQUIRED,
        data: "",
        error: "",
      });
    }
    // find room using roomid
    const findRoom = await Room.findOne({ where: { id: roomid } });
    if (!findRoom) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        errorCode: "",
        message: MESSAGES.GIVE_VALID_ID,
        data: "",
        error: "",
      });
    }
    // find user using userid
    const user = await User.findOne({ where: { id: userid } });
    if (!user) {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
        status: HTTP_STATUS_CODE.NOT_FOUND,
        errorCode: "",
        message: MESSAGES.USER_NOT_FOUND,
        data: "",
        error: "",
      });
    }

    // check in db user is exist or not
    const existingUser = await RoomUser.findOne({
      where: { userid, roomid },
    });
    if (existingUser) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        errorCode: "",
        message: MESSAGES.ALL_READY_IN_ROOM,
        data: "",
        error: "",
      });
    }

    // Add user to the room
    const Roomuser = await RoomUser.create({ userid, roomid });

    return res.status(HTTP_STATUS_CODE.OK).json({
      status: HTTP_STATUS_CODE.OK,
      errorCode: "",
      message: MESSAGES.JOIN_ROOM_SUCCESS,
      error: "",
      data: Roomuser,
    });
  } catch (error) {
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
      errorCode: "",
      message: error.message,
      data: "",
      error: "",
    });
  }
};

/**
 * @function leaveRoom
 * @description leave room using roomid
 * @param {object} req - request object
 * @param {string} req.body.id - roomid
 * @returns {object} - leave room successfully
 */
// leave room

const leaveRoom = async (req, res) => {
  try {
    const { roomid } = req.body;
    const userid = req.user.id;
    //
    if (!roomid || !userid) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        errorCode: "",
        message: MESSAGES.ALL_FIELDS_REQUIRED,
        data: "",
        error: "",
      });
    }

    const roomMember = await RoomUser.findOne({ where: { userid, roomid } });

    if (!roomMember) {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
        status: HTTP_STATUS_CODE.NOT_FOUND,
        errorCode: "",
        message: MESSAGES.NOT_PART_OF_ROOM,
        data: "",
        error: "",
      });
    }

    await RoomUser.destroy({ where: { userid, roomid } });

    return res.status(HTTP_STATUS_CODE.OK).json({
      status: HTTP_STATUS_CODE.OK,
      errorCode: "",
      message: MESSAGES.LEFT_ROOM,
      data: "",
      error: "",
    });
  } catch (error) {
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
      errorCode: "",
      message: error.message,
      data: "",
      error: "",
    });
  }
};

/**
 * @function deleteRoom
 * @description delete room using roomid
 * @param {object} req - request object
 * @param {string} req.body.id - roomid
 * @returns {object} - delete room successfully
 */
// delete room

const deleteRoom = async (req, res) => {
  try {
    const { roomid } = req.body;
    const userid = req.user.id;
    // check both is given or not
    if (!roomid || !userid) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        errorCode: "",
        message: MESSAGES.ALL_FIELDS_REQUIRED,
        data: "",
        error: "",
      });
    }
    // find room using roomid
    const chekId = await Room.findOne({ where: { id: roomid } });
    // check creator is user or not
    if (chekId.creatorid === userid) {
      await chekId.destroy();
      return res.status(HTTP_STATUS_CODE.OK).json({
        status: HTTP_STATUS_CODE.OK,
        errorCode: "",
        message: MESSAGES.DELETE_ROOM,
        data: "",
        error: "",
      });
    } else {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
        status: HTTP_STATUS_CODE.UNAUTHORIZED,
        errorCode: "",
        message: MESSAGES.NOT_AUTHOR,
        data: "",
        error: "",
      });
    }
  } catch (error) {
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
      errorCode: "",
      message: error.message,
      data: "",
      error: "",
    });
  }
};

/**
 * @function sendMessage
 * @description sendMessage to room
 * @param {object} req - request object
 * @param {string} req.body.id - roomid
 * @returns {object} - send msg to room
 */
///////////////////
// send message to room
// req.user - check user exists in room
// send message to room
// mesage - room id, message
// store in database

const sendMessage = async (req, res) => {
  try {
    const { roomid, message } = req.body;
    const userid = req.user.id;
    // check all fields is given or not
    if (!roomid || !userid || !message) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        errorCode: "",
        message: MESSAGES.ALL_FIELDS_REQUIRED,
        data: "",
        error: "",
      });
    }
    // call function for create msg and send to socket
    const msg = await sendMessageSocket(roomid, message, userid);

    // get msg value from the msg object
    const messageFromMsg = msg.dataValues.message;
    return res.status(HTTP_STATUS_CODE.OK).json({
      status: HTTP_STATUS_CODE.OK,
      errorCode: "",
      message: MESSAGES.MESSAGE_SEND,
      error: "",
      data: messageFromMsg,
    });
  } catch (error) {
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
      errorCode: "",
      message: error.message,
      data: "",
      error: "",
    });
  }
};
// connect to socket and get all thingds
const sendMessageSocket = async (roomid, message, userid) => {
  const findinRoomuser = await RoomUser.findOne({ where: { roomid, userid } });
  if (!findinRoomuser) {
    return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
      status: HTTP_STATUS_CODE.BAD_REQUEST,
      errorCode: "",
      message: MESSAGES.NOT_PART_OF_ROOM,
      data: "",
      error: "",
    });
  }
  // create message
  const newMessage = await Message.create({
    roomid,
    message,
    senderid: userid,
  });
  // return new message
  return newMessage;
};

/**
 * @function getAllMsgOfRoomId
 * @description get all messages of room using roomid
 * @param {object} req - request object
 * @param {string} req.body.id - roomid
 * @returns {object} - send msg to room
 */

//////////////////
// get messages of room by room id
// req.user - check user exists in room
// get messages of room

const getAllMsgOfRoomId = async (req, res) => {
  try {
    const { roomid } = req.body;
    const userid = req.user.id;

    if (!roomid || !userid) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        errorCode: "",
        message: MESSAGES.ALL_FIELDS_REQUIRED,
        data: "",
        error: "",
      });
    }

    // check user isin room or not
    const checkUserinRoom = await RoomUser.findOne({
      where: {
        [Op.and]: [{ userid: userid }, { roomid: roomid }],
      },
    });
    // if not send msg to user
    if (!checkUserinRoom) {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
        status: HTTP_STATUS_CODE.UNAUTHORIZED,
        errorCode: "",
        message: MESSAGES.NOT_PART_OF_ROOM,
        data: "",
        error: "",
      });
    }
    // if part then find all messages of this romm
    const AllMessage = await Message.findAll({ where: { roomid } });

    return res.status(HTTP_STATUS_CODE.OK).json({
      status: HTTP_STATUS_CODE.OK,
      errorCode: "",
      message: MESSAGES.ALL_MSG,
      data: "",
      error: "",
      messages: AllMessage,
    });
  } catch (error) {
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
      errorCode: "",
      message: error.message,
      data: "",
      error: "",
    });
  }
};

/**
 * @function getAllUserOfRoom
 * @description get all user of room using roomid
 * @param {object} req - request object
 * @param {string} req.body.id - roomid
 * @returns {object} - send user list which is part of this group
 */
/////////////////
// get all users of room
// room id

const getAllUserOfRoom = async (req, res) => {
  try {
    const { roomid } = req.body;
    if (!roomid) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        errorCode: "",
        message: MESSAGES.ALL_FIELDS_REQUIRED,
        data: "",
        error: "",
      });
    }

    // check room is exist or not
    const checkIdExist = await Room.findOne({ where: { id: roomid } });
    if (!checkIdExist) {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
        status: HTTP_STATUS_CODE.NOT_FOUND,
        errorCode: "",
        message: MESSAGES.ROOM_IS_NOT_PRESENT,
        data: "",
        error: "",
      });
    }

    // find user using room id
    const alluser = await RoomUser.findAll({ where: { roomid } });

    return res.status(HTTP_STATUS_CODE.OK).json({
      status: HTTP_STATUS_CODE.OK,
      errorCode: "",
      message: MESSAGES.GET_ALL_USER,
      data: "",
      error: "",
      users: alluser,
    });
  } catch (error) {
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
      errorCode: "",
      message: error.message,
      data: "",
      error: "",
    });
  }
};

/////////////////
// get all users

const getAllUser = async (req, res) => {
  const alluser = await User.findAll();
  return res.status(HTTP_STATUS_CODE.OK).json({
    users: alluser,
  });
};

/**
 * @function SendMsgToPerson
 * @description send message to person using its id
 * @param {object} req - request object
 * @param {string} req.body.id - roomid and message
 * @returns {object} - get response of message details
 */
/////////////////////
// send Message to person (save message)
// req.user, message, receiver id
// store in database

const SendMsgToPerson = async (req, res) => {
  try {
    const { message, receiverid } = req.body;
    const userid = req.user.id;
    // verify all fields is given or not
    if (!message || !receiverid || !userid) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        errorCode: "",
        message: MESSAGES.ALL_FIELDS_REQUIRED,
        data: "",
        error: "",
      });
    }
    // call function to connect socket and crate message
    const msg = await SendMsgToPersonSocket(receiverid, message, userid);
    // get value of user message
    const messageFromMsg = msg.dataValues.message;

    return res.status(HTTP_STATUS_CODE.OK).json({
      status: HTTP_STATUS_CODE.OK,
      errorCode: "",
      message: MESSAGES.MSG_SAVE,
      data: "",
      error: "",
      data: messageFromMsg,
    });
  } catch (error) {
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
      errorCode: "",
      message: error.message,
      data: "",
      error: "",
    });
  }
};
// connect to socket and get all thingds
const SendMsgToPersonSocket = async (receiverid, message, userid) => {
  if (!message || !receiverid || !userid) {
    return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
      status: HTTP_STATUS_CODE.BAD_REQUEST,
      errorCode: "",
      message: MESSAGES.ALL_FIELDS_REQUIRED,
      data: "",
      error: "",
    });
  }
  // create message
  const newMessage = await Message.create({
    receiverid,
    message,
    senderid: userid,
  });
  // return message
  return newMessage;
};

/**
 * @function getMsgsOfUser
 * @description get message of user
 * @param {object} req - request object
 * @param {string} req.body - receiverid
 * @returns {object} - get response of all message details between to user
 */
///////////////////////////
// get messages of person
// req.user, user id
// message sender req.user reciver user or sender user and reciver req.user
// send messages

const getMsgsOfUser = async (req, res) => {
  try {
    const { Userid } = req.body;
    const userid = req.user.id;

    // check all fields is given or not
    if (!Userid || !userid) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        errorCode: "",
        message: MESSAGES.ALL_FIELDS_REQUIRED,
        data: "",
        error: "",
      });
    }
    // find messages of both user between them
    const messagesofPerson = await Message.findAll({
      where: {
        [Op.or]: [
          {
            [Op.and]: [
              { senderid: userid }, // senderid = userid
              { receiverid: Userid }, // receverid = receiverid
            ],
          },
          {
            [Op.and]: [
              { senderid: Userid }, // senderid = receiverid
              { receiverid: userid }, // receverid = userid
            ],
          },
        ],
      },
      order: [["createdAt", "ASC"]], // Order messages by time
    });

    return res.status(HTTP_STATUS_CODE.OK).json({
      status: HTTP_STATUS_CODE.OK,
      errorCode: "",
      message: MESSAGES.GET_ALL_USER,
      data: "",
      error: "",
      messages: messagesofPerson,
    });
  } catch (error) {
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
      errorCode: "",
      message: error.message,
      data: "",
      error: "",
    });
  }
};



/**
 * @function uploadImg
 * @description get message of user
 * @param {object} req - request object
 * @param {string} req.body - receiverid
 * @returns {object} - get response of all message details between to user
 */

const uploadImg = async(req,res)=>{
  try {

    const { message, receiverid } = req.body;
    const userid = req.user.id;
    // verify all fields is given or not
    if (!message || !receiverid || !userid) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        errorCode: "",
        message: MESSAGES.ALL_FIELDS_REQUIRED,
        data: "",
        error: "",
      });
    }

  if (!req.file) {
    return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
      status: HTTP_STATUS_CODE.BAD_REQUEST,
        errorCode: "",
        message: MESSAGES.FILE_NOT_UPLOADED,
        data: "",
        error: "",
    });
  }
  

  const fileUrl = `/uploads/${req.file.filename}`; 
  
  console.log("File uploaded:", req.file);

  
  res.json({ fileUrl });

  } catch (error) {
    
  }
}


module.exports = {
  test,
  getAllRoom,
  getAllRoomsByUserId,
  getOneRoomById,
  createRoom,
  joinRoom,
  leaveRoom,
  deleteRoom,
  sendMessage,
  SendMsgToPerson,
  getAllMsgOfRoomId,
  getMsgsOfUser,
  getAllUserOfRoom,
  getAllUser,
  getMe,
  SendMsgToPersonSocket,
  sendMessageSocket,
};
