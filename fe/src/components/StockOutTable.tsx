// src/components/StockOutTable.tsx
import React from "react";

interface StockOutItem {
  stock_out_id: number;
  product: string;
  quantity: number;
  date_out: string;
  store: string | null;
}

interface StockOutTableProps {
  data: StockOutItem[];
}

const StockOutTable: React.FC<StockOutTableProps> = ({ data }) => {
  return (
    <table
      border={1}
      cellPadding={5}
      cellSpacing={0}
      style={{ width: "100%", textAlign: "left" }}
    >
      <thead>
        <tr>
          <th>Mã sản phẩm</th>
          <th>Sản phẩm</th>
          <th>Số lượng</th>
          <th>Ngày xuất hàng</th>
          <th>Cửa hàng</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.stock_out_id}>
            <td>{item.stock_out_id}</td>
            <td>{item.product}</td>
            <td>{item.quantity}</td>
            <td>
              {new Date(item.date_out).toLocaleDateString("vi-VN")}{" "}
              {new Date(item.date_out).toLocaleTimeString("vi-VN")}
            </td>
            <td>{item.store || "N/A"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StockOutTable;
