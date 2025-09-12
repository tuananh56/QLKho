import React, { useState } from "react";

interface InventoryItem {
  product: string;
  warehouse: string;
  quantity: number;
}

interface InventoryTableProps {
  data: InventoryItem[];
  rowsPerPage?: number;
}

const InventoryTable: React.FC<InventoryTableProps> = ({
  data,
  rowsPerPage = 20,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpPage, setJumpPage] = useState("");
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = data.slice(startIndex, startIndex + rowsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleJump = () => {
    const page = parseInt(jumpPage);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setJumpPage("");
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      pageNumbers.push(1);
      if (currentPage > 4) pageNumbers.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pageNumbers.push(i);
      if (currentPage < totalPages - 3) pageNumbers.push("...");
      pageNumbers.push(totalPages);
    }

    return pageNumbers.map((num, idx) =>
      num === "..." ? (
        <span key={idx} style={{ margin: "0 5px" }}>
          ...
        </span>
      ) : (
        <button
          key={idx}
          onClick={() => handlePageChange(Number(num))}
          style={{
            margin: "0 3px",
            fontWeight: Number(num) === currentPage ? "bold" : "normal",
          }}
        >
          {num}
        </button>
      )
    );
  };

  return (
    <div>
      <table
        border={1}
        cellPadding={5}
        cellSpacing={0}
        style={{ width: "100%", textAlign: "left" }}
      >
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Kho</th>
            <th>Số lượng</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item, idx) => (
            <tr key={startIndex + idx}>
              <td>{item.product}</td>
              <td>{item.warehouse}</td>
              <td>{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div style={{ marginTop: 10, textAlign: "center" }}>
          {/* Dòng 1: Thanh phân trang */}
          <div
            style={{ display: "inline-flex", gap: "5px", alignItems: "center" }}
          >
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

          {/* Dòng 2: Đến trang [input] OK, riêng 1 div để xuống dòng */}
          <div
            style={{
              marginTop: 8,
              display: "inline-flex", // vẫn dùng inline-flex để căn giữa nội dung
              gap: "5px",
              alignItems: "center",
            }}
          >
            <span>Đến trang</span>
            <input
              type="number"
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              style={{ width: 50 }}
              min={1}
              max={totalPages}
            />
            <button onClick={handleJump}>Đi</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryTable;
