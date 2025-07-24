const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const pickupRoutes = require("./routes/pickupRoutes");
const reverseGeocodeRoute = require('./routes/reverseGeocode');

const YAML = require("yamljs");
const swaggerUi = require("swagger-ui-express");
const Admin = require("./models/Admin");
const bcrypt = require("bcryptjs");
const helmet = require("helmet");

// async function createAdmin() {
//   const existing = await Admin.findOne({ email: "admin@example.com" });
//   if (!existing) {
//     const hashed = await bcrypt.hash("admin123", 10);
//     await Admin.create({ name: "Super Admin", email: "admin@example.com", password: hashed });
//     console.log("Admin created");
//   }
// }
// createAdmin();

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(helmet()); // Security headers

// CORS origins from environment variable
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [
  'http://localhost:5173', // Frontend dev
  // Add your production frontend URL here
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

// Enforce HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect('https://' + req.headers.host + req.url);
    }
    next();
  });
}

//  Swagger docs
if (process.env.NODE_ENV !== 'production') {
  const swaggerDocument = YAML.load('./swagger.yaml');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

//  Routes
app.use("/api/pickup", pickupRoutes);
app.use("/api/ngo", require("./routes/ngoRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/resort", require("./routes/resortRoutes"));
app.use('/api/location', reverseGeocodeRoute);
app.use("/api/geocode", require("./routes/geocodeRoutes"));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

app.listen(5000, () => console.log("Server running on port 5000"));

// TODO: Add rate limiting to all login, registration, and OTP endpoints
// TODO: Move all hardcoded emails (e.g., admin notification) to environment variables
// TODO: Add input validation to all controllers
// TODO: Ensure error responses never leak stack traces
