const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const User = require("../../db/models/user");
const { generateToken } = require("../utils/jwt");
const verifyToken = require("../utils/verifyGoogle");

const MESSAGES = require("../utils/Messages");
const HTTP_STATUS_CODE = require("../utils/HttpStatusCodes");
const {  validationSignup, validationEmailLogin } = require("../validation/Validation");

/**
 * @function handleSignup
 * @description create user using its details
 * @param {Request} req
 * @param {Response} res
 * @returns {object} - user information as object in response
 */
// function for the signup
const handleSignup = async (req, res) => {
  try {
    const {error} = validationSignup(req.body)
    if (error) {
      console.log(error);
      return res.send(error.details)
    }
    // validate all fields are require
    const { firstname, lastname, email, password, mobile } = req.body;
    // if (!firstname || !lastname || !email || !password || !mobile) {
    //   return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
    //     status: HTTP_STATUS_CODE.BAD_REQUEST,
    //     errorCode: "",
    //     message: MESSAGES.ALL_FIELDS_REQUIRED,
    //     data: "",
    //     error: "",
    //   });
    // }
    const id = uuidv4();

    // if all field is fullfield the generate hash password
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    // select all fields for create user in database
    const userData = {
      id,
      firstname,
      lastname,
      email,
      mobile,
      password: hashPassword,
    };
    // check email already is exist in database or not
    const existEmail = await User.findOne({ where: { email } });
    if (existEmail) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        errorCode: "",
        message: MESSAGES.EMAIL_ALREADY_EXIST,
        data: "",
        error: "",
      });
    }
    // check mobile already is exist in database or not
    const existMobile = await User.findOne({ where: { mobile } });
    if (existMobile) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        errorCode: "",
        message: MESSAGES.MOBILE_ALREADY_EXIST,
        data: "",
        error: "",
      });
    }
    // create user
    const newUser = await User.create(userData);
    return res.status(HTTP_STATUS_CODE.OK).json({
      message: MESSAGES.USER_CREATED,
      user: {
        id: newUser.id,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email,
        mobile: newUser.mobile,
      },
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
 * @function handleEmailLogin
 * @description login user using email and password
 * @param {Request} req
 * @param {Response} res
 * @returns {object} - user token as response
 */
// function for handle email login
const handleEmailLogin = async (req, res) => {
  try {
    const {error} = validationEmailLogin(req.body)

    if (error) {
      console.log(error);
      return res.send(error.details)
    }

    const { email, password } = req.body;
    // check email or password is given or not
    if (!email || !password) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        errorCode: "",
        message: MESSAGES.ALL_FIELDS_REQUIRED,
        data: "",
        error: "",
      });
    }
    // find user based on the email
    const user = await User.findOne({ where: { email } });
    // if no user then through error
    if (!user) {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
        status: HTTP_STATUS_CODE.NOT_FOUND,
        errorCode: "",
        message: MESSAGES.NOT_FOUND,
        data: "",
        error: "",
      });
    }
    // compare password in databse with given password
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
        status: HTTP_STATUS_CODE.UNAUTHORIZED,
        errorCode: "",
        message: MESSAGES.INVALID_PASSWORD,
        data: "",
        error: "",
      });
    }

    // create payload
    const payload = {
      id: user.id,
      email: user.email,
    };
    // generate token
    const token = generateToken(payload);
    return res.status(HTTP_STATUS_CODE.OK).json({
      status: HTTP_STATUS_CODE.findOne,
      errorCode: "",
      message: MESSAGES.USER_LOGGED_IN_SUCCESSFULLY,
      data: "",
      error: "",
      token,
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
 * @function handleMobileLogin
 * @description login user using contact no. and password
 * @param {Request} req
 * @param {Response} res
 * @returns {object} - user token as response
 */
// function for handle email login
const handleMobileLogin = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        errorCode: "",
        message: MESSAGES.ALL_FIELDS_REQUIRED,
        data: "",
        error: "",
      });
    }

    const user = await User.findOne({ where: { mobile } });
    if (!user) {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
        status: HTTP_STATUS_CODE.NOT_FOUND,
        errorCode: "",
        message: MESSAGES.NOT_FOUND,
        data: "",
        error: "",
      });
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
        status: HTTP_STATUS_CODE.UNAUTHORIZED,
        errorCode: "",
        message: MESSAGES.INVALID_PASSWORD,
        data: "",
        error: "",
      });
    }
    const payload = {
      id: user.id,
      mobile: user.mobile,
    };
    const token = generateToken(payload);
    return res.status(HTTP_STATUS_CODE.OK).json({
      status: HTTP_STATUS_CODE.findOne,
      errorCode: "",
      message: MESSAGES.USER_LOGGED_IN_SUCCESSFULLY,
      data: "",
      error: "",
      token,
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
 * @function handleGoogleLogin
 * @description login user using google id
 * @param {Request} req
 * @param {Response} res
 * @returns {object} - user token as response
 */
// function for handle email login
const handleGoogleLogin = async (req, res) => {
  try {
    const token = req.body.token;
    // check token
    if (!token) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        errorCode: "",
        message: MESSAGES.ALL_FIELDS_REQUIRED,
        data: "",
        error: "",
      });
    }
    // take info from the token
    const payload = await verifyToken(token);
    // check user is existing or not
    const existingUser = await User.findOne({
      where: { email: payload.email },
    });
    // create payload using email or id
    const jwtPayload = {
      email: payload.email,
    };
    // if no existing user the create it
    if (!existingUser) {
      const newUser = await User.create({
        id: uuidv4(),
        firstName: payload.given_name,
        lastName: payload.family_name,
        email: payload.email,
      });
      // if user create then id is this
      jwtPayload.id = newUser.id;
    } else {
      // else this
      jwtPayload.id = existingUser.id;
    }
    // generate jwt token
    const jwtToken = generateToken(jwtPayload);
    // send responses
    res.json({
      status: HTTP_STATUS_CODE.findOne,
      errorCode: "",
      message: MESSAGES.USER_LOGGED_IN_SUCCESSFULLY,
      data: "",
      error: "",
      success: true,
      token: jwtToken,
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
// simpal logout controller
const handleLogout = (req, res) => {
  res.json({ message: "User logout" });
};

module.exports = {
  handleSignup,
  handleEmailLogin,
  handleMobileLogin,
  handleGoogleLogin,
  handleLogout,
};
