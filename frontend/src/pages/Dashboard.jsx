import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchStations } from "../api";
import StationCard from "../components/StationCard";
import StationList from "../components/StationList";
import FilterBar from "../components/FilterBar";

export default function Dashboard() {
  const [stations, setStations] = useState([]);
  const [filter, setFilter] = useState("All");
  const [view, setView] = useState("card");

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 300000); // refresh every 5 mins
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const { data } = await fetchStations();
      setStations(data);
    } catch (e) {
      console.error("Failed to load stations", e);
    }
  };

  const filtered = useMemo(() => {
    return stations.filter(
      (st) => filter === "All" || st.latestReading?.status === filter
    );
  }, [stations, filter]);

  // Counts for all stations (Active/Inactive) to pass to pie page
  const counts = useMemo(() => {
    const active = stations.filter(s => s.latestReading?.status === "Active").length;
    const inactive = stations.filter(s => s.latestReading?.status === "Inactive").length;
    return { active, inactive };
  }, [stations]);

  return (
    <div className="container mt-5">
      <h2 className="text-center fw-bold mb-4">⛽ Fuel Stations Dashboard</h2>

      {/* Button to Pie Chart page; send current counts so chart renders instantly */}
      <div className="text-center mb-4">
        <Link
          to="/piechart"
          state={{ counts }}
          className="btn btn-primary btn-lg shadow-sm"
        >
          📊 View Pie Chart
        </Link>
      </div>

      <div className="d-flex justify-content-center mb-5">
        <div
          className="p-3 rounded shadow-sm bg-light w-100"
          style={{ maxWidth: "900px" }}
        >
          <FilterBar
            filter={filter}
            setFilter={setFilter}
            view={view}
            setView={setView}
          />
        </div>
      </div>

      {view === "card" ? (
        <div className="d-flex flex-wrap justify-content-center gap-4">
          {filtered.map((st) => (
            <div
              key={st.stationId}
              className="flex-grow-1 flex-shrink-0"
              style={{ minWidth: "250px", maxWidth: "300px" }}
            >
              <StationCard station={st} />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4">
          <StationList stations={filtered} />
        </div>
      )}
    </div>
  );
}
