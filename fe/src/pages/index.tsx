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
  const [totalInventory, setTotalInventory] = useState<TotalInventoryItem[]>(
    []
  );

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
    <div style={{ padding: 20 }}>
      <h1>QLKho Dashboard</h1>

      {/* 👇 thêm button điều hướng */}
      <div style={{ marginTop: 20, marginBottom: 20 }}>
        <Link href="/stock-in/StockInPage">
          <button
            style={{
              backgroundColor: "#2563eb",
              color: "white",
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
            }}
          >
            ➕ Tạo phiếu nhập kho
          </button>
        </Link>
      </div>

       <div style={{ marginTop: 20, marginBottom: 20 }}>
        <Link href="/stock-out/StockOutPage">
          <button
            style={{
              backgroundColor: "#2563eb",
              color: "white",
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
            }}
          >
            ➕ Tạo phiếu xuất kho
          </button>
        </Link>
      </div>

      <section style={{ marginTop: 20 }}>
        <h2>Tồn kho</h2>
        <InventoryTable data={inventory} />
      </section>

      <section style={{ marginTop: 20 }}>
        <h2>Sản phẩm xuất kho</h2>
        <StockOutTable data={stockOut} />
      </section>

      <section style={{ marginTop: 20 }}>
        <h2>Tồn kho thấp</h2>
        <AlertsTable data={alerts} />
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>Tổng sản phảm tồn kho</h2>
        <MonthlyChart data={totalInventory} />
      </section>
    </div>
  );
}
