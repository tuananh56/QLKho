import { useEffect, useState } from "react";
import api from "../services/api";
import Link from "next/link";
import InventoryTable from "../components/InventoryTable";
import StockInTable from "../components/StockInTable";
import StockOutTable from "../components/StockOutTable";
import AlertsTable from "../components/AlertsTable";
import MonthlyChart from "../components/MonthlyChart";
import {
  InventoryItem,
  StockInItem,
  StockOutItem,
  AlertItem,
  TotalInventoryItem,
} from "../types";
import StockInList from "@/components/StockInList";

export default function DashboardPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [stockIn, setStockIn] = useState<StockInItem[]>([]);
  const [stockOut, setStockOut] = useState<StockOutItem[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [totalInventory, setTotalInventory] = useState<TotalInventoryItem[]>([]);

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

        const totalRes = await api.get<TotalInventoryItem[]>("/total-inventory");
        setTotalInventory(totalRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-5 animate-fadeIn">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">QLKho Dashboard</h1>

      {/* Buttons */}
      <div className="space-y-4 mb-8">
        <Link href="/stock-in/StockInPage">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            ➕ Tạo phiếu nhập kho
          </button>
        </Link>

        <Link href="/stock-out/StockOutPage">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            ➕ Tạo phiếu xuất kho
          </button>
        </Link>

        <Link href="/inventory/inventoryPage">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
            📦 Xem tồn kho
          </button>
        </Link>

        <Link href="/subWarehouse/subWarehousePage">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
            Kho con
          </button>
        </Link>

        <Link href="/warehouse/warehousePage">
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition">
            🏭 Danh sách kho
          </button>
        </Link>

        <Link href="/warehouse-transfer/warehouseTransferPage">
          <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition">
            🔄 Chuyển kho
          </button>
        </Link>

        <Link href="/report/monthly">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
            📊 Xem báo cáo nhập/xuất theo tháng
          </button>
        </Link>
      </div>

      {/* Tables & Charts */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">📦 Tồn kho</h2>
        <InventoryTable data={inventory} />
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">📤 Sản phẩm xuất kho</h2>
        <StockOutTable data={stockOut} />
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">⚠️ Tồn kho thấp</h2>
        <AlertsTable data={alerts} />
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Tổng sản phẩm tồn kho</h2>
        <MonthlyChart data={totalInventory} />
      </section>
    </div>
  );
}
