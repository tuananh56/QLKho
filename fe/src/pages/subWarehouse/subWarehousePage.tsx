import { useEffect, useState } from "react";
import {
  getAllSubWarehouse,
  createSubWarehouse,
  updateSubWarehouse,
  deleteSubWarehouse,
  getAllWarehouse,
  SubWarehouse,
  Warehouse,
  CreateSubWarehouseDto,
  UpdateSubWarehouseDto,
} from "@/services/subWarehouseService";

export default function SubWarehousePage() {
  const [subWarehouses, setSubWarehouses] = useState<SubWarehouse[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<SubWarehouse | null>(null);
  const [formData, setFormData] = useState<CreateSubWarehouseDto>({
    warehouse_id: 0,
    name: "",
    address: "",
  });

  // phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [gotoPage, setGotoPage] = useState("");

  useEffect(() => {
    fetchWarehouses();
    fetchSubWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const data = await getAllWarehouse();
      setWarehouses(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách kho cha:", error);
    }
  };

  const fetchSubWarehouses = async () => {
    try {
      const data = await getAllSubWarehouse();
      setSubWarehouses(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách kho con:", error);
    }
  };

  const handleEdit = (item: SubWarehouse) => {
    setEditingItem(item);
    setFormData({
      warehouse_id: item.warehouse.warehouse_id,
      name: item.name,
      address: item.address || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc muốn xóa kho con này?")) {
      await deleteSubWarehouse(id);
      fetchSubWarehouses();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const payload: UpdateSubWarehouseDto = { ...formData };
        await updateSubWarehouse(editingItem.sub_id, payload);
      } else {
        await createSubWarehouse(formData);
      }
      setShowForm(false);
      setEditingItem(null);
      setFormData({ warehouse_id: 0, name: "", address: "" });
      fetchSubWarehouses();
    } catch (error) {
      console.error("Lỗi khi lưu kho con:", error);
    }
  };

  // ================= Phân trang =================
  const totalPages = Math.ceil(subWarehouses.length / itemsPerPage);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = subWarehouses.slice(indexOfFirst, indexOfLast);

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  const handleGotoPage = () => {
    let page = Number(gotoPage);
    if (!isNaN(page)) {
      if (page < 1) page = 1;
      if (page > totalPages) page = totalPages;
      setCurrentPage(page);
      setGotoPage("");
    }
  };

  // ==============================================

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Quản lý Kho Con</h1>
      <button
        onClick={() => (window.location.href = "http://localhost:4000/")}
        className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
      >
        ⬅ Quay lại trang chính
      </button>
      <button
        className="bg-blue-500 text-white px-3 py-2 rounded mb-4"
        onClick={() => {
          setShowForm(true);
          setEditingItem(null);
          setFormData({ warehouse_id: 0, name: "", address: "" });
        }}
      >
        Thêm kho con
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded">
          <div className="mb-2">
            <label className="block font-medium">Kho cha</label>
            <select
              value={formData.warehouse_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  warehouse_id: Number(e.target.value),
                })
              }
              className="border px-2 py-1 w-full"
              required
            >
              <option value={0}>Chọn kho cha</option>
              {warehouses.map((w) => (
                <option key={w.warehouse_id} value={w.warehouse_id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-2">
            <label className="block font-medium">Tên kho con</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="border px-2 py-1 w-full"
              required
            />
          </div>

          <div className="mb-2">
            <label className="block font-medium">Địa chỉ</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="border px-2 py-1 w-full"
            />
          </div>

          <button
            type="submit"
            className="bg-green-500 text-white px-3 py-2 rounded mr-2"
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
        </form>
      )}

      {/* ================= Bảng dữ liệu ================= */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Tên kho con</th>
            <th className="border px-2 py-1">Kho cha</th>
            <th className="border px-2 py-1">Địa chỉ</th>
            <th className="border px-2 py-1">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((sw) => (
            <tr key={sw.sub_id}>
              <td className="border px-2 py-1">{sw.sub_id}</td>
              <td className="border px-2 py-1">{sw.name}</td>
              <td className="border px-2 py-1">{sw.warehouse.name}</td>
              <td className="border px-2 py-1">{sw.address || "-"}</td>
              <td className="border px-2 py-1">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  onClick={() => handleEdit(sw)}
                >
                  Sửa
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(sw.sub_id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
          {currentItems.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-2">
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ================= Phân trang ================= */}
      <div className="flex flex-col items-center mt-4 space-y-4">
        {/* nút chuyển trang */}
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

        {/* ô nhập đi đến trang */}
        <div className="flex items-center space-x-1 text-sm">
          <span>Đến trang</span>
          <div className="flex items-center border rounded overflow-hidden">
            <input
              type="number"
              value={gotoPage}
              onChange={(e) => setGotoPage(e.target.value)}
              className="w-14 px-2 py-1 outline-none"
            />
            <button
              onClick={handleGotoPage}
              className="px-2 bg-blue-500 text-white hover:bg-blue-600"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
