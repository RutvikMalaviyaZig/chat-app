const express = require("express");
const { verifyAuthMiddleware } = require("../middlewares/verfiyAuthMIddleware");
const router = express.Router();

router.get("/google", (req, res) => {
  res.render("google", { googleClientId: process.env.GOOGLE_CLIENT_ID });
});

router.get("/success", verifyAuthMiddleware, (req, res) => {
  res.render("success");
});

module.exports = router;
