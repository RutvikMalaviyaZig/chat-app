const express = require("express");
const { verifyAuthMiddleware } = require("../middlewares/verfiyAuthMIddleware");
const { handleGetProfile } = require("../controllers/userController");
const router = express.Router();

router.get("/profile", verifyAuthMiddleware, handleGetProfile);

module.exports = router;
