const express = require("express");
const {
  handleEmailLogin,
  handleMobileLogin,
  handleSignup,
  handleLogout,
  handleGoogleLogin,
} = require("../controllers/authController");
const router = express.Router();

router.post("/email/login", handleEmailLogin);
router.post("/mobile/login", handleMobileLogin);
router.post("/google", handleGoogleLogin);
router.post("/signup", handleSignup);
router.put("/logout", handleLogout);

module.exports = router;
