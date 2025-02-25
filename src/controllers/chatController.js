
const Message = require('../../db/models/message');
const Room = require('../../db/models/room');
const RoomUser = require('../../db/models/roomUser');
const User = require('../../db/models/user')
const { Op } = require("sequelize");

const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer();
const io = new Server(server);


const test = (req, res) => {
    return res.json({ message: "Hello World" });
}

/**
 * @function getAllRooms
 * @description Get all rooms of logged in user
 * @param {object} req - request object
 * @returns {object} - rooms of logged in user
 */
const getAllRoomsByUserId = async (req, res) => {
    // find rooms with login user id
    // send to response

    try {
        const { userid } = req.body;
        if (!userid) {
            return res.status(400).json({
                message: "please feel all fealds"
            })
        }

        const chekUserinDb = await User.findOne({ where: { id: userid } })
        if (!chekUserinDb) {
            return res.status(400).json({
                message: "please do signup/login"
            })
        }

        const allRooms = await Room.findAll({ where: { creatorid: userid } })
        if (!allRooms) {
            return res.status(400).json({
                message: "you have no rooms"
            })
        }

        return res.status(200).json({
            message: "Successfully get All Room With Userid ",
            rooms: allRooms
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }

}



const getAllRoom = async (req, res) => {
    try {
        const AllRooms = await Room.findAll()
        return res.status(200).json({
            message: "get all rooms",
            rooms: AllRooms
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

/**
 * @function getOneRoomById
 * @description Get a room by id
 * @param {object} req - request object
 * @param {string} req.params.roomId - room id
 * @returns {object} - room of param id of logged in user
 */
const getOneRoomById = async (req, res) => {
    // find room with roomid
    // check req.user id and room users - exists
    // send room

    try {
        const { roomid } = req.body
        const userId = req.user.id
        if (!roomid) {
            return res.status(400).json({
                message: "please feel all fealds"
            })
        }

        const checkUserinRoomUser = await RoomUser.findOne({ where: { userid: userId } })
        if (!checkUserinRoomUser) {
            return res.status(400).json({
                message: "you are not a user of this room pls join room "
            })
        }

        const roomfind = await RoomUser.findOne({ where: { roomid: roomid, userid: userId } })
        if (!roomfind) {
            return res.status(400).json({
                message: "room with this id is not found"
            })
        }

        return res.status(200).json({
            message: "room get successfully by id",
            room: roomfind
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }

}

// create room
// req.user
/**
 * @function createRoom
 * @description create room using name of room
 * @param {object} req - request object
 * @param {string} req.body.name - room name
 * @returns {object} - roomid and creatorid room name
 */
const createRoom = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user.id;

        if (!name) {
            return res.status(400).json({
                message: "please feel all fealds"
            })
        }

        const createRoom = await Room.create({ name: name, creatorid: userId })

        return res.status(201).json({
            message: "Room created successfully",
            data: createRoom
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }

}





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
        const { roomid } = req.body
        const userid = req.user.id

        if (!roomid) {
            return res.status(400).json({
                message: "please feel all fealds"
            })
        }

        const findRoom = await Room.findOne({ where: { id: roomid } });
        if (!findRoom) {
            return res.status(400).json({
                message: "please give valid id"
            })
        }

        const user = await User.findOne({ where: { id: userid } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }


        const existingUser = await RoomUser.findOne({
            where: { userid, roomid },
        });
        if (existingUser) {
            return res.status(400).json({ message: "User already in room" });
        }

        // Add user to the room
        const Roomuser = await RoomUser.create({ userid, roomid });


        return res.status(200).json({
            message: "User join room successfully",
            data: Roomuser
        })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}




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
        const { roomid } = req.body
        const userid = req.user.id;

        if (!roomid || !userid) {
            return res.status(400).json({
                message: "please feel all fealds"
            })
        }

        const roomMember = await RoomUser.findOne({ where: { userid, roomid } });

        if (!roomMember) {
            return res.status(404).json({ message: "User is not in the room" });
        }

        await RoomUser.destroy({ where: { userid, roomid } });

        return res.status(200).json({ message: "User left room successfully" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}



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
        const { roomid } = req.body

        if (!roomid) {
            return res.status(400).json({
                message: "please feel all fealds"
            })
        }

        const chekId = await Room.findOne({ where: { id: roomid } })

        if (!chekId) {
            return res.status(404).json({
                message: "please check roomid "
            })
        }

        await chekId.destroy()

        return res.status(200).json({
            message: "room deleted successfully"
        })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}




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
        const { roomid, message } = req.body
        const userid = req.user.id

        const findinRoomuser = await RoomUser.findOne({ where: { roomid, userid } })
        if (!findinRoomuser) {
            return res.status(400).json({
                message: "pls join room you are not a part of room"
            })
        }

        const newMessage = await Message.create({ roomid, message, senderid: userid });


        return res.status(200).json({
            message: "message sended successfully",
            message: newMessage
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}




//////////////////
// get messages of room by room id
// req.user - check user exists in room
// get messages of room

const getAllMsgOfRoomId = async (req, res) => {
    try {
        const { roomid } = req.body
        const userid = req.user.id
        if (!roomid || !userid) {
            return res.status(400).json({
                message: "All fields require"
            })
        }

        const checkUserinRoom = await RoomUser.findOne({
            where: {
                [Op.and]: [
                    { userid: userid },
                    { roomid: roomid }
                ]
            }
        })
        if (!checkUserinRoom) {
            return res.status(404).json({
                message: "you are not a part of group"
            })
        }

        const AllMessage = await Message.findAll({ where: { roomid } })

        return res.status(200).json({
            message: "get all messages",
            messages: AllMessage
        })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}



/////////////////
// get all users of room
// room id 

const getAllUserOfRoom = async (req, res) => {
    try {
        const { roomid } = req.body
        if (!roomid) {
            return res.status(400).json({
                message: "All fields require"
            })
        }

        const checkIdExist = await Room.findOne({ where: { id: roomid } })
        if (!checkIdExist) {
            return res.status(404).json({
                message: "Room is not present"
            })
        }

        const alluser = await RoomUser.findAll({ where: { roomid } });

        return res.status(200).json({
            message: "get all user successfully",
            users: alluser
        })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}



/////////////////
// get all users 

const getAllUser = async (req, res) => {
    const alluser = await User.findAll();
    return res.status(200).json({
        message: "success",
        users: alluser
    })
}


/////////////////////
// send Message to person (save message)
// req.user, message, receiver id
// store in database

const SendMsgToPerson = async (req, res) => {
    try {
        const { message, receiverid } = req.body
        const userid = req.user.id

        if (!message || !receiverid || !userid) {
            return res.status(400).json({
                message: "All fields require"
            })
        }

        const newMessage = await Message.create({ receiverid, message, senderid: userid });



        return res.status(200).json({
            message: "message saved successfully",
            message: newMessage
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

///////////////////////////
// get messages of person
// req.user, user id
// message sender req.user reciver user or sender user and reciver req.user
// send messages

const getMsgsOfUser = async (req, res) => {
    try {
        const { Userid } = req.body
        const userid = req.user.id

        if (!Userid || !userid) {
            return res.status(400).json({
                message: "All fields require"
            })
        }

        const messagesofPerson = await Message.findAll({
            where: {
                [Op.or]: [
                    {
                        [Op.and]: [
                            { senderid: userid },     // senderid = userid
                            { receiverid: Userid } // receverid = receiverid
                        ]
                    },
                    {
                        [Op.and]: [
                            { senderid: Userid }, // senderid = receiverid
                            { receiverid: userid }     // receverid = userid
                        ]
                    }
                ]
            },
            order: [["createdAt", "ASC"]] // Optional: Order messages by time
        });

        return res.status(200).json({
            message: "get all msg of person with given id",
            messages: messagesofPerson
        })
    } catch (error) {
        return res.status(500).json({ message: error.message });
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
    getAllUser
}
