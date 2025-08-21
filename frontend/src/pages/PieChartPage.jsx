import React, { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { fetchPieChartData } from "../api";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChartPage() {
  const location = useLocation();
  // If navigated from Dashboard, we get initial counts here
  const initialCounts = location.state?.counts || null;

  const [counts, setCounts] = useState(initialCounts);

  useEffect(() => {
    // Always refresh from backend (no hardcoded numbers)
    const load = async () => {
      try {
        const data = await fetchPieChartData(); // { active, inactive }
        setCounts(data);
      } catch (e) {
        console.error("Failed to load pie data", e);
      }
    };
    load();
  }, []);

  const chartData = useMemo(() => {
    if (!counts) return null;
    return {
      labels: ["Active", "Inactive"],
      datasets: [
        {
          label: "Stations",
          data: [counts.active, counts.inactive],
          backgroundColor: ["#4caf50", "#f44336"], // green, red
          borderColor: ["#ffffff", "#ffffff"],
          borderWidth: 2,
        },
      ],
    };
  }, [counts]);

  const options = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      tooltip: { enabled: true },
    },
  }), []);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold m-0">📊 Stations Status Overview</h2>
        <Link to="/" className="btn btn-outline-secondary">← Back to Dashboard</Link>
      </div>

      <div className="d-flex justify-content-center">
        {/* No "Loading..." text. Render chart only when data is ready. */}
        {chartData ? (
          <div style={{ width: 420, minHeight: 320 }}>
            <Pie data={chartData} options={options} />
          </div>
        ) : (
          <div style={{ width: 420, minHeight: 320 }} />
        )}
      </div>
    </div>
  );
}
