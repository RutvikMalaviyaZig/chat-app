const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const User = require("../../db/models/user");
const { generateToken } = require("../utils/jwt");
const verifyToken = require("../utils/verifyGoogle");

const handleSignup = async (req, res) => {
  const { firstName, lastName, email, password, mobile } = req.body;
  if (!firstName || !lastName || !email || !password || !mobile) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const id = uuidv4();
  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt);
  const userData = {
    id,
    firstName,
    lastName,
    email,
    mobile,
    password: hashPassword,
  };
  try {
    const existEmail = await User.findOne({ where: { email } });
    if (existEmail) {
      return res.status(400).json({ message: "Email already exist" });
    }
    const existMobile = await User.findOne({ where: { mobile } });
    if (existMobile) {
      return res.status(400).json({ message: "Mobile already exist" });
    }
    const newUser = await User.create(userData);
    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        mobile: newUser.mobile,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error" + error.message });
  }
};

const handleEmailLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const payload = {
      id: user.id,
      email: user.email,
    };
    const token = generateToken(payload);
    return res.status(200).json({
      message: "User logged in successfully",
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const handleMobileLogin = async (req, res) => {
  const { mobile, password } = req.body;

  if (!mobile || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ where: { mobile } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const payload = {
      id: user.id,
      mobile: user.mobile,
    };
    const token = generateToken(payload);
    return res.status(200).json({
      message: "User logged in successfully",
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const handleGoogleLogin = async (req, res) => {
  const token = req.body.token;
  if (!token) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const payload = await verifyToken(token);
    const existingUser = await User.findOne({
      where: { email: payload.email },
    });
    const jwtPayload = {
      email: payload.email,
    };
    if (!existingUser) {
      const newUser = await User.create({
        id: uuidv4(),
        firstName: payload.given_name,
        lastName: payload.family_name,
        email: payload.email,
      });
      jwtPayload.id = newUser.id;
    } else {
      jwtPayload.id = existingUser.id;
    }

    const jwtToken = generateToken(jwtPayload);

    res.json({
      message: "User logged in successfully",
      success: true,
      token: jwtToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

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
