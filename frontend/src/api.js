import axios from "axios";

// ✅ Use environment variable (falls back to localhost:4000 if not set)
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// Fetch stations list
export const fetchStations = () => API.get("/stations");

// Fetch piechart data (active vs inactive)
// Returns { active, inactive }
export const fetchPieChartData = async () => {
  const res = await API.get("/piechart");
  return res.data;
};