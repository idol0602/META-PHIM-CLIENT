"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import axiosInstance from "../global/axiosInstance";
import API from "../api/index";

export default function CustomChart({ type = "line" }) {
  const [mounted, setMounted] = useState(false);
  const [current, setCurrent] = useState([]);
  const [pre, setPre] = useState([]);
  const [suggestMovies, setListSuggestMovies] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const suggestMovies = await API.getTypeMovies("top_movies", 1);
      setListSuggestMovies(suggestMovies);
    }
    fetchData();
  }, []);

  useEffect(() => {
    axiosInstance.get("/getSoLuotXemNgay").then((response) => {
      setCurrent(response.data.currentMonth);
      setPre(response.data.lastMonth);
    });
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const combinedData = useMemo(() => {
    const maxLength = Math.max(current.length, pre.length);
    return Array.from({ length: maxLength }, (_, i) => ({
      name: `Ngày ${i + 1}`,
      pv: current[i] || 0,
      value: pre[i] || 0,
    }));
  }, [current, pre]);

  const pieData = useMemo(() => {
    return suggestMovies.map((movie) => ({
      name: movie.title || "Không tên",
      value: movie.viewCount || 0,
      color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
    }));
  }, [suggestMovies]);

  if (!mounted) return null;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "#2d3748",
            padding: "10px",
            border: "1px solid #4b5563",
            borderRadius: "5px",
            color: "#e2e8f0",
          }}
        >
          <p className="mb-0 fw-bold">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="mb-0" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (type === "line") {
    return (
      <div style={{ height: "350px", width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={combinedData}
            margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
            />
            <XAxis
              dataKey="name"
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: "rgba(255,255,255,0.5)" }}
            />
            <YAxis
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: "rgba(255,255,255,0.5)" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: "rgba(255,255,255,0.7)" }} />
            <Line
              type="monotone"
              dataKey="pv"
              name="Tháng này"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="value"
              name="Tháng trước"
              stroke="#f97316"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === "bar") {
    return (
      <div style={{ height: "350px", width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={combinedData}
            margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
            />
            <XAxis
              dataKey="name"
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: "rgba(255,255,255,0.5)" }}
            />
            <YAxis
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: "rgba(255,255,255,0.5)" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: "rgba(255,255,255,0.7)" }} />
            <Bar
              dataKey="pv"
              name="Tháng này"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="value"
              name="Tháng trước"
              fill="#f97316"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return null;
}
