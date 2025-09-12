import { StockInItem } from "../types";

interface StockInTableProps {
  data: StockInItem[];
}

const StockInTable: React.FC<StockInTableProps> = ({ data }) => {
  return (
    <table border={1} cellPadding={5} cellSpacing={0} style={{ width: "100%", textAlign: "left" }}>
      <thead>
        <tr>
          <th>Mã ID</th>
          <th>Sản phẩm</th>
          <th>Số lượng</th>
          <th>Ngày nhập hàng</th>
          <th>Nhà sản xuất</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.stock_in_id}>
            <td>{item.stock_in_id}</td>
            <td>{item.product}</td>
            <td>{item.quantity}</td>
            <td>{new Date(item.date_in).toLocaleString("vi-VN")}</td>
            <td>{item.manufacturer?.name ?? "N/A"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StockInTable; 