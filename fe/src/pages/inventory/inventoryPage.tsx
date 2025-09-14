import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllInventory } from "../../services/inventoryService";
import { InventoryItem } from "../../types";

const InventoryPage = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // search + phân trang
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [gotoPage, setGotoPage] = useState(""); // input "Đến trang"
  const itemsPerPage = 10; // số dòng mỗi trang
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

  if (loading) return <p>Đang tải dữ liệu...</p>;

  // lọc dữ liệu theo searchTerm
  const filteredData = inventory.filter(
    (item) =>
      item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.warehouse.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // phân trang
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

  // hiển thị tối đa 2 trang đầu + 2 trang cuối
  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, 2);

      if (currentPage > 3) pages.push("...");

      if (currentPage > 2 && currentPage < totalPages - 1) {
        pages.push(currentPage);
      }

      if (currentPage < totalPages - 2) pages.push("...");

      pages.push(totalPages - 1, totalPages);
    }

    return pages;
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">📦 Tồn kho</h1>
        <button
          onClick={() => router.push("http://localhost:4000/")}
          className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          ⬅ Quay lại Dashboard
        </button>
      </div>
      {/* ô tìm kiếm */}
      <input
        type="text"
        placeholder="Tìm kiếm sản phẩm hoặc kho..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className="border px-3 py-2 mb-4 w-full rounded"
      />

      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Sản phẩm</th>
            <th className="border px-4 py-2">Kho</th>
            <th className="border px-4 py-2">Số lượng hiện có</th>
          </tr>
        </thead>
        <tbody>
          {currentData.length > 0 ? (
            currentData.map((item, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{item.product}</td>
                <td className="border px-4 py-2">{item.warehouse}</td>
                <td className="border px-4 py-2 text-center">
                  {item.quantity}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="border px-4 py-2 text-center">
                Không có dữ liệu tồn kho
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* phân trang */}
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
};

export default InventoryPage;
