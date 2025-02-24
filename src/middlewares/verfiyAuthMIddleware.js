const { verifyToken } = require("../utils/jwt");

const verifyAuthMiddleware = (req, res, next) => {
  const barearToken = req.headers.authorization;
  if (!barearToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = barearToken.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = { verifyAuthMiddleware };
