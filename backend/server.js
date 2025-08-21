const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
const stationsRoute = require("./routes/stationRoutes");
const pieChartRoute = require("./routes/piechartRoutes"); // <— exact file name

app.use("/api/stations", stationsRoute);
app.use("/api/piechart", pieChartRoute);

// DB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((e) => console.error("❌ MongoDB error:", e));

// START
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
