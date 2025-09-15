"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../../services/api";

interface SubWarehouseSummary {
  name: string;
  quantity: number;
}

interface WarehouseDisplay {
  warehouse: string;
  total_quantity: number;
  sub_warehouses: SubWarehouseSummary[];
}

export default function WarehousePage() {
  const [warehouses, setWarehouses] = useState<WarehouseDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const res = await api.get<any[]>("../warehouses/summary"); 
      const rawData = res.data;

      // Gom nhóm dữ liệu theo warehouse
      const grouped: Record<string, WarehouseDisplay> = {};
      rawData.forEach((item: any) => {
        if (!grouped[item.warehouse]) {
          grouped[item.warehouse] = {
            warehouse: item.warehouse,
            total_quantity: Number(item.quantity_in_warehouse),
            sub_warehouses: [],
          };
        }
        grouped[item.warehouse].sub_warehouses.push({
          name: item.sub_name || "Không có kho con",
          quantity: Number(item.quantity_in_sub || 0),
        });
      });

      // Lọc theo search
      let filtered = Object.values(grouped);
      if (debouncedSearch.trim() !== "") {
        const keyword = debouncedSearch.toLowerCase();
        filtered = filtered
          .map((w) => ({
            ...w,
            sub_warehouses: w.sub_warehouses.filter((sub) =>
              sub.name.toLowerCase().includes(keyword)
            ),
          }))
          .filter(
            (w) =>
              w.warehouse.toLowerCase().includes(keyword) ||
              w.sub_warehouses.length > 0
          );
      }

      setWarehouses(filtered);
      setCurrentPage(1); // reset page
      setError(null);
    } catch (err: any) {
      setError(err.message || "Error fetching warehouse data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, [debouncedSearch]);

  // Pagination
  const totalPages = Math.ceil(warehouses.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentWarehouses = warehouses.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 2;

    if (totalPages <= 4) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > maxPagesToShow + 1) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - maxPagesToShow) pages.push("...");
      pages.push(totalPages);
    }

    return pages.map((p, idx) =>
      p === "..." ? (
        <span key={idx} className="px-2">
          ...
        </span>
      ) : (
        <button
          key={idx}
          onClick={() => handlePageChange(Number(p))}
          style={{
            padding: "3px 8px",
            border:
              Number(p) === currentPage ? "1px solid blue" : "1px solid gray",
            backgroundColor: Number(p) === currentPage ? "#e0f0ff" : "#fff",
            cursor: "pointer",
          }}
        >
          {p}
        </button>
      )
    );
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ textAlign: "center", marginBottom: 20 }}>Danh sách kho</h1>

      <div style={{ marginBottom: 20, textAlign: "center" }}>
        <Link href="/">
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
            🔙 Quay lại Dashboard
          </button>
        </Link>
      </div>

      {/* Search & Reset */}
      <div
        style={{
          marginBottom: 20,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
        }}
      >
        <input
          type="text"
          placeholder="Tìm kiếm kho hoặc kho con..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "6px 10px",
            width: 300,
            border: "1px solid #ccc",
            borderRadius: 6,
          }}
        />
        <button
          onClick={() => setSearch("")}
          style={{
            padding: "6px 12px",
            backgroundColor: "#f87171",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          ❌ Reset
        </button>
      </div>

      <table
        border={1}
        cellPadding={8}
        cellSpacing={0}
        style={{
          margin: "20px auto",
          borderCollapse: "collapse",
          minWidth: "600px",
          textAlign: "center",
        }}
      >
        <thead style={{ backgroundColor: "#f3f4f6" }}>
          <tr>
            <th>Kho</th>
            <th>Tổng số lượng</th>
            <th>Kho con</th>
            <th>Số lượng sản phẩm kho con</th>
          </tr>
        </thead>
        <tbody>
          {currentWarehouses.length === 0 && (
            <tr>
              <td colSpan={4}>Không có dữ liệu</td>
            </tr>
          )}
          {currentWarehouses.map((w) =>
            w.sub_warehouses.map((sub, idx) => (
              <tr key={w.warehouse + idx}>
                <td>{w.warehouse}</td>
                <td>{w.total_quantity}</td>
                <td>{sub.name}</td>
                <td>{sub.quantity}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ marginTop: 20, textAlign: "center" }}>{renderPageNumbers()}</div>
      )}
    </div>
  );
}
