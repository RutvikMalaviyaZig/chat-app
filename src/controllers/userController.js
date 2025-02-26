const User = require("../../db/models/user");

const MESSAGES = require("../utils/Messages");
const HTTP_STATUS_CODE = require("../utils/HttpStatusCodes");

/**
 * @function handleGetProfile
 * @description get profile of user
 * @param {object} req - request object
 * @param {string} req.user.id - userid
 * @returns {object} - user information in response
 */

// get userProfile
const handleGetProfile = async (req, res) => {
  const { id } = req.user;
  try {
    // find user based on the id
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
        status: HTTP_STATUS_CODE.NOT_FOUND,
        errorCode: "",
        message: MESSAGES.USER_NOT_FOUND,
        data: "",
        error: "",
      });
    }
    // else give user details
    return res.status(HTTP_STATUS_CODE.OK).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
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

module.exports = { handleGetProfile };
