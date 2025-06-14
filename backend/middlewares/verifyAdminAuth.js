// middleware/verifyAdminAuth.js
const jwt = require("jsonwebtoken");

const verifyAdminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Token not provided
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied: Not an admin" });
    }

    req.admin = decoded; // you can access this in your controller
    next(); // allow access
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = verifyAdminAuth;
