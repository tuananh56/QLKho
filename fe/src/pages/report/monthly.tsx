"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface MonthlyReport {
  month: number;
  total_quantity: number;
}

export default function MonthlyReportPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [stockInReport, setStockInReport] = useState<MonthlyReport[]>([]);
  const [stockOutReport, setStockOutReport] = useState<MonthlyReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReports();
  }, [year]);

  const fetchReports = async () => {
    setLoading(true);
    setError("");
    try {
      const [inRes, outRes] = await Promise.all([
        axios.get<MonthlyReport[]>(`http://localhost:4001/stock-in/report/monthly?year=${year}`),
        axios.get<MonthlyReport[]>(`http://localhost:4001/stock-out/report/monthly?year=${year}`)
      ]);
      setStockInReport(inRes.data);
      setStockOutReport(outRes.data);
    } catch (err: any) {
      setError(err.message || "Lỗi khi lấy dữ liệu báo cáo");
    } finally {
      setLoading(false);
    }
  };

  const chartData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const inQty = stockInReport.find((r) => r.month === month)?.total_quantity || 0;
    const outQty = stockOutReport.find((r) => r.month === month)?.total_quantity || 0;
    return {
      month: `Tháng ${month}`,
      Nhập: inQty,
      Xuất: outQty,
      difference: inQty - outQty,
    };
  });

  const totalIn = chartData.reduce((acc, cur) => acc + cur.Nhập, 0);
  const totalOut = chartData.reduce((acc, cur) => acc + cur.Xuất, 0);
  const totalDiff = totalIn - totalOut;

  return (
    <div style={{ padding: 30, fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>📊 Báo cáo nhập/xuất theo tháng - {year}</h1>

      {/* Button quay về */}
      <button
        onClick={() => window.location.href = "http://localhost:4000/"}
        style={{
          marginBottom: 20,
          padding: "8px 16px",
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        ⬅️ Quay về trang chủ
      </button>

      <div style={{ marginBottom: 20 }}>
        <label style={{ marginRight: 10, fontWeight: "bold" }}>Chọn năm:</label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "1px solid #ccc",
            width: 100,
          }}
        />
      </div>

      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <>
          {/* Summary Cards */}
          <div style={{ display: "flex", gap: 20, marginBottom: 30 }}>
            <div style={{ flex: 1, background: "#16a34a", color: "white", padding: 20, borderRadius: 12 }}>
              <p>Tổng nhập</p>
              <p style={{ fontSize: 24, fontWeight: "bold" }}>{totalIn}</p>
            </div>
            <div style={{ flex: 1, background: "#dc2626", color: "white", padding: 20, borderRadius: 12 }}>
              <p>Tổng xuất</p>
              <p style={{ fontSize: 24, fontWeight: "bold" }}>{totalOut}</p>
            </div>
            <div style={{ flex: 1, background: "#2563eb", color: "white", padding: 20, borderRadius: 12 }}>
              <p>Chênh lệch</p>
              <p style={{ fontSize: 24, fontWeight: "bold" }}>{totalDiff}</p>
            </div>
          </div>

          {/* Bảng dữ liệu */}
          <div style={{ overflowX: "auto", marginBottom: 40 }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "center",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              <thead style={{ backgroundColor: "#f3f4f6" }}>
                <tr>
                  <th style={{ padding: 12 }}>Tháng</th>
                  <th style={{ padding: 12, backgroundColor: "#dbeafe", color: "#1e3a8a" }}>Nhập</th>
                  <th style={{ padding: 12, backgroundColor: "#fee2e2", color: "#b91c1c" }}>Xuất</th>
                  <th style={{ padding: 12 }}>Chênh lệch</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((d) => (
                  <tr key={d.month} style={{ backgroundColor: parseInt(d.month.replace("Tháng ", "")) % 2 === 0 ? "#f9fafb" : "#ffffff" }}>
                    <td style={{ padding: 12, fontWeight: "bold" }}>{d.month}</td>
                    <td style={{ padding: 12, color: "#1e3a8a" }}>{d.Nhập}</td>
                    <td style={{ padding: 12, color: "#b91c1c" }}>{d.Xuất}</td>
                    <td style={{ padding: 12, color: d.difference > 0 ? "green" : d.difference < 0 ? "red" : "gray" }}>
                      {d.difference > 0 ? "↗️" : d.difference < 0 ? "↘️" : "➡️"} {Math.abs(d.difference)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Biểu đồ cột */}
          <h2 style={{ marginBottom: 20 }}>📊 Biểu đồ nhập/xuất theo tháng</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend verticalAlign="top" />
              <Bar dataKey="Nhập" fill="#1e3a8a" />
              <Bar dataKey="Xuất" fill="#b91c1c" />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}
