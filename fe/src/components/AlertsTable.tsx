// src/components/AlertsTable.tsx
import React from 'react';

interface AlertItem {
  product: string;
  warehouse: string;
  quantity: number;
}

interface AlertsTableProps {
  data: AlertItem[];
}

const AlertsTable: React.FC<AlertsTableProps> = ({ data }) => {
  return (
    <table border={1} cellPadding={5} cellSpacing={0} style={{ width: '100%', textAlign: 'left' }}>
      <thead>
        <tr>
          <th>Sản phẩm</th>
          <th>Kho</th>
          <th>Số lượng</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, idx) => (
          <tr key={idx} style={{ color: item.quantity < 10 ? 'red' : 'black' }}>
            <td>{item.product}</td>
            <td>{item.warehouse}</td>
            <td>{item.quantity}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AlertsTable;
