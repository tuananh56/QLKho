"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllInventory } from "../../services/inventoryService";
import { InventoryItem } from "../../types";

const InventoryPage = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [gotoPage, setGotoPage] = useState("");
  const itemsPerPage = 10;
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rawData: InventoryItem[] = await getAllInventory();
        setInventory(rawData);
      } catch (error) {
        console.error("Lỗi khi load tồn kho:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-10 animate-pulse">
        Đang tải dữ liệu...
      </p>
    );

  const filteredData = inventory.filter(
    (item) =>
      item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.warehouse.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleGotoPage = () => {
    const pageNum = parseInt(gotoPage, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
    setGotoPage("");
  };

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, 2);
      if (currentPage > 3) pages.push("...");
      if (currentPage > 2 && currentPage < totalPages - 1) pages.push(currentPage);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages - 1, totalPages);
    }
    return pages;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
          📦 Tồn kho
        </h1>
        <button
          onClick={() => router.push("http://localhost:4000/")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transform hover:scale-105 transition"
        >
          ⬅ Quay lại Dashboard
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Tìm kiếm sản phẩm hoặc kho..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className="w-full mb-6 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm transition"
      />

      {/* Table */}
      <div className="overflow-x-auto shadow-xl rounded-xl bg-white animate-fadeIn">
        <table className="min-w-full border-collapse rounded-xl overflow-hidden">
          <thead className="bg-gradient-to-r from-blue-100 to-blue-200 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 text-left text-gray-700 font-bold uppercase tracking-wider">
                Tên sản phẩm
              </th>
              <th className="px-6 py-4 text-left text-gray-700 font-bold uppercase tracking-wider">
                Kho
              </th>
              <th className="px-6 py-4 text-center text-gray-700 font-bold uppercase tracking-wider">
                Số lượng hiện có
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((item, index) => {
                let color = "text-gray-800";
                let icon = "✅";

                if (item.quantity === 0) {
                  color = "text-red-600 font-bold";
                  icon = "❌";
                } else if (item.quantity < 50) {
                  color = "text-yellow-600";
                  icon = "⚠️";
                } else {
                  color = "text-green-600";
                }

                return (
                  <tr
                    key={index}
                    className={`transition duration-300 ease-in-out hover:bg-blue-50 hover:shadow-md ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4">{item.product}</td>
                    <td className="px-6 py-4">{item.warehouse}</td>
                    <td className={`px-6 py-4 text-center font-semibold ${color}`}>
                      {item.quantity} {icon}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                  Không có dữ liệu tồn kho
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
        <div className="flex items-center space-x-2">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-200 transition"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            &lt;
          </button>

          {renderPageNumbers().map((page, i) =>
            page === "..." ? (
              <span key={i} className="px-2 text-gray-500">
                ...
              </span>
            ) : (
              <button
                key={i}
                onClick={() => setCurrentPage(page as number)}
                className={`px-3 py-1 border rounded transition ${
                  currentPage === page
                    ? "bg-blue-500 text-white shadow-md"
                    : "hover:bg-gray-200"
                }`}
              >
                {page}
              </button>
            )
          )}

          <button
            className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-200 transition"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>

        {/* Go to page */}
        <div className="flex items-center space-x-2 text-sm">
          <span>Đến trang</span>
          <div className="flex items-center border rounded overflow-hidden">
            <input
              type="number"
              value={gotoPage}
              onChange={(e) => setGotoPage(e.target.value)}
              className="w-16 px-2 py-1 outline-none"
            />
            <button
              onClick={handleGotoPage}
              className="px-3 py-1 bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              OK
            </button>
          </div>
        </div>
      </div>

      {/* Tailwind animation */}
      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default InventoryPage;