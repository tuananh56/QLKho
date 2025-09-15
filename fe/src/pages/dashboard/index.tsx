"use client";

import { useEffect, useState } from "react";
import api from "../../services/api";
import InventoryTable from "../../components/InventoryTable";
import StockInTable from "../../components/StockInTable";
import StockOutTable from "../../components/StockOutTable";
import AlertsTable from "../../components/AlertsTable";
import MonthlyChart from "../../components/MonthlyChart";
import "../styles/globals.css";

import {
  InventoryItem,
  StockInItem,
  StockOutItem,
  AlertItem,
  TotalInventoryItem,
} from "../../types";

export default function DashboardPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [stockIn, setStockIn] = useState<StockInItem[]>([]);
  const [stockOut, setStockOut] = useState<StockOutItem[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [totalInventory, setTotalInventory] = useState<TotalInventoryItem[]>(
    []
  );
  const [menuOpen, setMenuOpen] = useState(false); // Mobile menu toggle

  useEffect(() => {
    const fetchData = async () => {
      try {
        const invRes = await api.get<InventoryItem[]>("/inventory");
        setInventory(invRes.data);

        const stockInRes = await api.get<StockInItem[]>("/stock-in?limit=5");
        setStockIn(stockInRes.data);

        const stockOutRes = await api.get<StockOutItem[]>("/stock-out?limit=5");
        setStockOut(stockOutRes.data);

        const alertsRes = await api.get<AlertItem[]>("/alerts?threshold=10");
        setAlerts(alertsRes.data);

        const totalRes = await api.get<TotalInventoryItem[]>(
          "/total-inventory"
        );
        setTotalInventory(totalRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="text-2xl font-bold text-blue-600">QLKho</div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-4">
            <button className="px-3 py-2 rounded hover:bg-blue-100 transition">
              Dashboard
            </button>
            <button className="px-3 py-2 rounded hover:bg-blue-100 transition">
              Tồn kho
            </button>
            <button className="px-3 py-2 rounded hover:bg-blue-100 transition">
              Phiếu nhập
            </button>
            <button className="px-3 py-2 rounded hover:bg-blue-100 transition">
              Phiếu xuất
            </button>
            <button className="px-3 py-2 rounded hover:bg-blue-100 transition">
              Báo cáo
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-300">
              Click me
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => (window.location.href = "http://localhost:4000/")}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              ⬅ Dashboard
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 focus:outline-none"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {menuOpen && (
          <nav className="md:hidden bg-white border-t border-gray-200 shadow-md">
            <div className="flex flex-col px-6 py-2 space-y-2">
              <button className="px-3 py-2 rounded hover:bg-blue-100 transition text-left">
                Dashboard
              </button>
              <button className="px-3 py-2 rounded hover:bg-blue-100 transition text-left">
                Tồn kho
              </button>
              <button className="px-3 py-2 rounded hover:bg-blue-100 transition text-left">
                Phiếu nhập
              </button>
              <button className="px-3 py-2 rounded hover:bg-blue-100 transition text-left">
                Phiếu xuất
              </button>
              <button className="px-3 py-2 rounded hover:bg-blue-100 transition text-left">
                Báo cáo
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-28 max-w-7xl mx-auto px-6 space-y-8">
        {/* Inventory */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4">📦 Tồn kho</h2>
          <InventoryTable data={inventory} />
        </section>

        {/* Stock In */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Phiếu nhập gần đây
          </h2>
          <StockInTable data={stockIn} />
        </section>

        {/* Stock Out */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Phiếu xuất gần đây
          </h2>
          <StockOutTable data={stockOut} />
        </section>

        {/* Alerts */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            ⚠️ Cảnh báo tồn kho thấp
          </h2>
          <AlertsTable data={alerts} />
        </section>

        {/* Monthly Chart */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Tổng tồn kho theo sản phẩm
          </h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-300">
            Click me
          </button>

          <MonthlyChart data={totalInventory} />
        </section>
      </main>
    </div>
  );
}
