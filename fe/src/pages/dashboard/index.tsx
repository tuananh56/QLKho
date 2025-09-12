import { useEffect, useState } from "react";
import api from "../../services/api";
import InventoryTable from "../../components/InventoryTable";
import StockInTable from "../../components/StockInTable";
import StockOutTable from "../../components/StockOutTable";
import AlertsTable from "../../components/AlertsTable";
import MonthlyChart from "../../components/MonthlyChart";
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

      <section style={{ marginTop: 20 }}>
        <h2>Tồn kho</h2> {/* Inventory */}
        <InventoryTable data={inventory} />
      </section>

      <section style={{ marginTop: 20 }}>
        <h2>Phiếu nhập gần đây</h2> {/* Recent Stock In */}
        <StockInTable data={stockIn} />
      </section>

      <section style={{ marginTop: 20 }}>
        <h2>Phiếu xuất gần đây</h2> {/* Recent Stock Out */}
        <StockOutTable data={stockOut} />
      </section>

      <section style={{ marginTop: 20 }}>
        <h2>Cảnh báo tồn kho thấp</h2> {/* Alerts (Low Inventory) */}
        <AlertsTable data={alerts} />
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>Tổng tồn kho theo sản phẩm</h2> {/* Total Inventory by Product */}
        <MonthlyChart data={totalInventory} />
      </section>
    </div>
  );
}
