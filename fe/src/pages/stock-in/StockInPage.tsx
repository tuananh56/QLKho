"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export interface StockInItem {
  stock_in_id: number;
  product: string;
  warehouse: string | null;
  quantity: number;
  date_in: string;
  manufacturer: string | null;
  note: string;
}

export default function StockInPage() {
  const router = useRouter();
  const [stockIns, setStockIns] = useState<StockInItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [sort, setSort] = useState<"asc" | "desc">("desc");

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchStockIns = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:4001/stock-in?search=${debouncedSearch}&sort=${sort}`
      );
      if (!res.ok) throw new Error("Failed to fetch data");
      const data: StockInItem[] = await res.json();
      setStockIns(data);
      setCurrentPage(1); // reset page khi search/sort
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockIns();
  }, [debouncedSearch, sort]);

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa phiếu nhập này?")) return;

    const res = await fetch(`http://localhost:4001/stock-in/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      alert("Xóa thất bại");
    } else {
      setStockIns(stockIns.filter((s) => s.stock_in_id !== id));
    }
  };

  // Phân trang logic
  const totalPages = Math.ceil(stockIns.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStockIns = stockIns.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          style={{
            padding: "3px 8px",
            border: i === currentPage ? "1px solid blue" : "1px solid gray",
            backgroundColor: i === currentPage ? "#e0f0ff" : "#fff",
          }}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý phiếu nhập</h1>

      {/* Search & Sort & Add */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="border p-2 flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border p-2"
          value={sort}
          onChange={(e) => setSort(e.target.value as "asc" | "desc")}
        >
          <option value="desc">Mới nhất</option>
          <option value="asc">Cũ nhất</option>
        </select>
        <button
          className="bg-blue-500 text-white px-3 py-2 rounded"
          onClick={() => router.push("create")}
        >
          Thêm phiếu nhập
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2">ID</th>
              <th className="border px-3 py-2">Sản phẩm</th>
              <th className="border px-3 py-2">Kho</th>
              <th className="border px-3 py-2">Số lượng</th>
              <th className="border px-3 py-2">Ngày nhập</th>
              <th className="border px-3 py-2">Nhà sản xuất</th>
              <th className="border px-3 py-2">Ghi chú</th>
              <th className="border px-3 py-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentStockIns.map((s) => (
              <tr key={s.stock_in_id} className="hover:bg-gray-50">
                <td className="border px-3 py-2">{s.stock_in_id}</td>
                <td className="border px-3 py-2">{s.product}</td>
                <td className="border px-3 py-2">{s.warehouse ?? "-"}</td>
                <td className="border px-3 py-2">{s.quantity}</td>
                <td className="border px-3 py-2">
                  {new Date(s.date_in).toLocaleString()}
                </td>
                <td className="border px-3 py-2">{s.manufacturer ?? "-"}</td>
                <td className="border px-3 py-2">{s.note ?? "-"}</td>
                <td className="border px-3 py-2 flex gap-1">
                  <button
                    className="text-blue-500"
                    onClick={() =>
                      router.push(`/stock-in/${s.stock_in_id}`)
                    }
                  >
                    Sửa
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => handleDelete(s.stock_in_id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ marginTop: 10, textAlign: "center" }}>
        <div style={{ display: "inline-flex", gap: "5px", alignItems: "center" }}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            {"<"}
          </button>
          {renderPageNumbers()}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
}
