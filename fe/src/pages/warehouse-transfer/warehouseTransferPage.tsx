"use client";

import { useEffect, useState } from "react";
import {
  getAllWarehouse,
  Warehouse,
  getAllSubWarehouse,
  SubWarehouse,
} from "@/services/subWarehouseService";
import {
  getAllTransfers,
  createTransfer,
  WarehouseTransfer,
} from "@/services/warehousetransferService";
import { getAllProducts, Product } from "@/services/productService";

export default function WarehouseTransferPage() {
  const [transfers, setTransfers] = useState<WarehouseTransfer[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [subWarehouses, setSubWarehouses] = useState<SubWarehouse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [formData, setFormData] = useState({
    productId: 0,
    fromWarehouseId: 0,
    toSubWarehouseId: 0,
    quantity: 0,
    note: "",
  });
  const [showForm, setShowForm] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Search & Sort
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [gotoPage, setGotoPage] = useState(1);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [t, w, s, p] = await Promise.all([
        getAllTransfers(),
        getAllWarehouse(),
        getAllSubWarehouse(),
        getAllProducts(),
      ]);
      setTransfers(t);
      setWarehouses(w);
      setSubWarehouses(s);
      setProducts(p);
    } catch (error) {
      console.error("Lỗi fetch data:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.productId ||
      !formData.fromWarehouseId ||
      !formData.toSubWarehouseId ||
      formData.quantity <= 0
    ) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    try {
      await createTransfer({
        product_id: formData.productId,
        from_warehouse_id: formData.fromWarehouseId,
        to_sub_warehouse_id: formData.toSubWarehouseId,
        quantity: formData.quantity,
        note: formData.note,
      });
      setShowForm(false);
      setFormData({
        productId: 0,
        fromWarehouseId: 0,
        toSubWarehouseId: 0,
        quantity: 0,
        note: "",
      });
      fetchData();
    } catch (error) {
      console.error(error);
      alert("Lỗi tạo chuyển kho");
    }
  };

  // Filter & Sort
  const sortedTransfers = [...transfers].sort((a, b) => {
    const dateA = new Date(a.transfer_date).getTime();
    const dateB = new Date(b.transfer_date).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const filteredTransfers = sortedTransfers.filter(
    (t) =>
      t.product.name.toLowerCase().includes(search.toLowerCase()) ||
      t.fromWarehouse.name.toLowerCase().includes(search.toLowerCase()) ||
      t.toSubWarehouse.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTransfers.length / rowsPerPage);
  const currentData = filteredTransfers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const renderPageNumbers = () => {
    let pages: (number | "...")[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 2 && i <= currentPage + 2)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  const handleGotoPage = () => {
    let page = Math.min(Math.max(Number(gotoPage), 1), totalPages);
    setCurrentPage(page);
  };

  return (
    <div className="p-4">
      <button
        onClick={() => (window.location.href = "http://localhost:4000/")}
        className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600 mb-4"
      >
        ⬅ Quay lại trang chính
      </button>

      <h1 className="text-xl font-bold mb-4">
        Chuyển sản phẩm từ kho chính sang kho con
      </h1>

      {/* Search & Sort */}
      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm / kho..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-2 py-1 w-1/2"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          className="border px-2 py-1"
        >
          <option value="desc">Mới nhất → Cũ nhất</option>
          <option value="asc">Cũ nhất → Mới nhất</option>
        </select>
      </div>

      <button
        className="bg-blue-500 text-white px-3 py-2 rounded mb-4"
        onClick={() => setShowForm(true)}
      >
        Thêm chuyển kho
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-4 p-4 border rounded space-y-2"
        >
          <div>
            <label>Sản phẩm</label>
            <select
              value={formData.productId}
              onChange={(e) =>
                setFormData({ ...formData, productId: Number(e.target.value) })
              }
              className="border px-2 py-1 w-full"
            >
              <option value={0}>Chọn sản phẩm</option>
              {products.map((p) => (
                <option key={p.product_id} value={p.product_id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Kho chính</label>
            <select
              value={formData.fromWarehouseId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  fromWarehouseId: Number(e.target.value),
                })
              }
              className="border px-2 py-1 w-full"
            >
              <option value={0}>Chọn kho chính</option>
              {warehouses
                .filter((w) => w.is_main)
                .map((w) => (
                  <option key={w.warehouse_id} value={w.warehouse_id}>
                    {w.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label>Kho con</label>
            <select
              value={formData.toSubWarehouseId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  toSubWarehouseId: Number(e.target.value),
                })
              }
              className="border px-2 py-1 w-full"
            >
              <option value={0}>Chọn kho con</option>
              {subWarehouses.map((s) => (
                <option key={s.sub_id} value={s.sub_id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Số lượng</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: Number(e.target.value) })
              }
              className="border px-2 py-1 w-full"
            />
          </div>

          <div>
            <label>Ghi chú</label>
            <input
              type="text"
              value={formData.note}
              onChange={(e) =>
                setFormData({ ...formData, note: e.target.value })
              }
              className="border px-2 py-1 w-full"
            />
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              className="bg-green-500 text-white px-3 py-2 rounded"
            >
              Lưu
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-400 text-white px-3 py-2 rounded"
            >
              Hủy
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Sản phẩm</th>
            <th className="border px-2 py-1">Kho chính</th>
            <th className="border px-2 py-1">Kho con</th>
            <th className="border px-2 py-1">Số lượng</th>
            <th className="border px-2 py-1">Ngày chuyển</th>
            <th className="border px-2 py-1">Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((t) => (
            <tr key={t.transfer_id}>
              <td className="border px-2 py-1">{t.transfer_id}</td>
              <td className="border px-2 py-1">{t.product.name}</td>
              <td className="border px-2 py-1">{t.fromWarehouse.name}</td>
              <td className="border px-2 py-1">{t.toSubWarehouse.name}</td>
              <td className="border px-2 py-1">{t.quantity}</td>
              <td className="border px-2 py-1">
                {new Date(t.transfer_date).toLocaleString()}
              </td>
              <td className="border px-2 py-1">{t.note || "-"}</td>
            </tr>
          ))}
          {currentData.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center py-2">
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex flex-col items-center mt-4 space-y-4">
        <div className="flex items-center space-x-2">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          {renderPageNumbers().map((page, i) =>
            page === "..." ? (
              <span key={i} className="px-2">
                ...
              </span>
            ) : (
              <button
                key={i}
                onClick={() => setCurrentPage(page as number)}
                className={`px-3 py-1 border rounded ${
                  currentPage === page ? "bg-blue-500 text-white" : ""
                }`}
              >
                {page}
              </button>
            )
          )}
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <span>Đến trang</span>
          <input
            type="number"
            value={gotoPage}
            onChange={(e) => setGotoPage(Number(e.target.value))}
            className="border px-2 py-1 w-16 text-center"
          />
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded"
            onClick={handleGotoPage}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
