"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export interface StockOutItem {
  stock_out_id: number;
  product: string;
  warehouse: string | null;
  quantity: number;
  date_out: string;
  store: string | null;
  note: string;
}

export default function StockOutPage() {
  const router = useRouter();
  const [stockOuts, setStockOuts] = useState<StockOutItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [sort, setSort] = useState<"asc" | "desc">("desc");

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchStockOuts = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:4001/stock-out?search=${debouncedSearch}&sort=${sort}`
      );
      if (!res.ok) throw new Error("Failed to fetch data");
      const data: StockOutItem[] = await res.json();
      setStockOuts(data);
      setCurrentPage(1);
      setSelectedIds([]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockOuts();
  }, [debouncedSearch, sort]);

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa phiếu xuất này?")) return;

    const res = await fetch(`http://localhost:4001/stock-out/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      alert("Xóa thất bại");
    } else {
      setStockOuts(stockOuts.filter((s) => s.stock_out_id !== id));
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return alert("Chưa chọn phiếu nào");
    if (!confirm(`Bạn có chắc muốn xóa ${selectedIds.length} phiếu xuất này?`))
      return;

    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetch(`http://localhost:4001/stock-out/${id}`, { method: "DELETE" })
        )
      );
      setStockOuts(stockOuts.filter((s) => !selectedIds.includes(s.stock_out_id)));
      setSelectedIds([]);
    } catch (err) {
      alert("Xóa thất bại");
    }
  };

  // Phân trang logic
  const totalPages = Math.ceil(stockOuts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStockOuts = stockOuts.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const maxPagesToShow = 2;
    const total = totalPages;

    if (total <= 4) {
      for (let i = 1; i <= total; i++) pageNumbers.push(i);
    } else {
      pageNumbers.push(1);

      if (currentPage > maxPagesToShow + 1) pageNumbers.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(total - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pageNumbers.push(i);

      if (currentPage < total - maxPagesToShow) pageNumbers.push("...");

      pageNumbers.push(total);
    }

    return pageNumbers.map((p, idx) =>
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
            border: Number(p) === currentPage ? "1px solid blue" : "1px solid gray",
            backgroundColor: Number(p) === currentPage ? "#e0f0ff" : "#fff",
          }}
        >
          {p}
        </button>
      )
    );
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Quản lý phiếu xuất kho</h1>

      <div className="p-4">
        <button
          className="mb-4 bg-gray-300 text-black px-3 py-2 rounded"
          onClick={() => router.back()}
        >
          ← Quay lại
        </button>

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
            Thêm phiếu xuất
          </button>
          <button
            className="bg-red-500 text-white px-3 py-2 rounded"
            onClick={handleDeleteSelected}
          >
            Xóa phiếu đã chọn
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length === currentStockOuts.length &&
                      currentStockOuts.length > 0
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds(currentStockOuts.map((s) => s.stock_out_id));
                      } else {
                        setSelectedIds([]);
                      }
                    }}
                  />
                </th>
                <th className="border px-3 py-2">ID</th>
                <th className="border px-3 py-2">Sản phẩm</th>
                <th className="border px-3 py-2">Kho</th>
                <th className="border px-3 py-2">Số lượng</th>
                <th className="border px-3 py-2">Ngày xuất</th>
                <th className="border px-3 py-2">Store</th>
                <th className="border px-3 py-2">Ghi chú</th>
                <th className="border px-3 py-2">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {currentStockOuts.map((s) => (
                <tr key={s.stock_out_id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(s.stock_out_id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds([...selectedIds, s.stock_out_id]);
                        } else {
                          setSelectedIds(
                            selectedIds.filter((id) => id !== s.stock_out_id)
                          );
                        }
                      }}
                    />
                  </td>
                  <td className="border px-3 py-2">{s.stock_out_id}</td>
                  <td className="border px-3 py-2">{s.product}</td>
                  <td className="border px-3 py-2">{s.warehouse ?? "-"}</td>
                  <td className="border px-3 py-2">{s.quantity}</td>
                  <td className="border px-3 py-2">
                    {new Date(s.date_out).toLocaleString()}
                  </td>
                  <td className="border px-3 py-2">{s.store ?? "-"}</td>
                  <td className="border px-3 py-2">{s.note ?? "-"}</td>
                  <td className="border px-3 py-2 flex gap-1">
                    <button
                      className="text-blue-500"
                      onClick={() => router.push(`/stock-out/${s.stock_out_id}`)}
                    >
                      Sửa
                    </button>
                    <button
                      className="text-red-500"
                      onClick={() => handleDelete(s.stock_out_id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-center items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2 py-1 border rounded"
          >
            {"<"}
          </button>

          {renderPageNumbers()}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 border rounded"
          >
            {">"}
          </button>

          <div className="inline-flex items-center gap-2 ml-4">
            <span>Đến trang</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
              className="border px-2 py-1 w-16"
            />
            <button
              className="bg-blue-500 text-white px-2 py-1 rounded"
              onClick={() => {
                if (currentPage >= 1 && currentPage <= totalPages) {
                  setCurrentPage(currentPage);
                }
              }}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
