const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const pickupRoutes = require("./routes/foodPickupRoutes");
const reverseGeocodeRoute = require('./routes/reverseGeocode');

const YAML = require("yamljs");
const swaggerUi = require("swagger-ui-express");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

//  Swagger docs
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//  Routes
app.use("/api/pickup", pickupRoutes);
app.use("/api/ngo", require("./routes/ngoRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/resort", require("./routes/resortRoutes"));
app.use('/api/location', reverseGeocodeRoute);
app.use("/api/geocode", require("./routes/geocodeRoutes"));

app.listen(5000, () => console.log("Server running on port 5000"));
