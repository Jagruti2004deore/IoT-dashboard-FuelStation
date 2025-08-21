const express = require("express");
const router = express.Router();
const Reading = require("../models/Reading");
const Station = require("../models/Station"); // fallback if needed

/**
 * GET /api/piechart
 * Counts Active vs Inactive based on the LATEST Reading per stationId.
 * Falls back to Station.status if there are no readings.
 */
router.get("/", async (req, res) => {
  try {
    // Try with latest readings (matches your Dashboard logic)
    const aggregated = await Reading.aggregate([
      { $sort: { timestamp: -1 } },              // newest first
      { $group: { _id: "$stationId", status: { $first: "$status" } } },
      {
        $group: {
          _id: null,
          active: { $sum: { $cond: [{ $eq: ["$status", "Active"] }, 1, 0] } },
          inactive: { $sum: { $cond: [{ $eq: ["$status", "Inactive"] }, 1, 0] } },
        },
      },
      { $project: { _id: 0, active: 1, inactive: 1 } },
    ]);

    let counts = aggregated[0];

    // Fallback: if there are no readings yet, count from Station.status
    if (!counts) {
      const [active, inactive] = await Promise.all([
        Station.countDocuments({ status: "Active" }),
        Station.countDocuments({ status: "Inactive" }),
      ]);
      counts = { active, inactive };
    }

    return res.json(counts);
  } catch (err) {
    console.error("❌ /api/piechart error:", err);
    return res.status(500).json({ error: "Failed to fetch pie chart data" });
  }
});

module.exports = router;
