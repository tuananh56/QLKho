import { useEffect, useState } from 'react';

export interface StockInItem {
  stock_in_id: number;
  product: string;
  warehouse: string | null;
  quantity: number;
  date_in: string;
  manufacturer: string | null;
  note: string;
}

export default function StockInList() {
  const [stockIns, setStockIns] = useState<StockInItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStockIns = async () => {
      try {
        const res = await fetch('http://localhost:4001/stock-in'); // BE URL
        if (!res.ok) throw new Error('Failed to fetch data');
        const data: StockInItem[] = await res.json();
        setStockIns(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStockIns();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Danh sách phiếu nhập</h2>
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Sản phẩm</th>
            <th className="border px-2 py-1">Kho</th>
            <th className="border px-2 py-1">Số lượng</th>
            <th className="border px-2 py-1">Ngày nhập</th>
            <th className="border px-2 py-1">Nhà sản xuất</th>
            <th className="border px-2 py-1">Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          {stockIns.map((s) => (
            <tr key={s.stock_in_id} className="hover:bg-gray-50">
              <td className="border px-2 py-1">{s.stock_in_id}</td>
              <td className="border px-2 py-1">{s.product}</td>
              <td className="border px-2 py-1">{s.warehouse}</td>
              <td className="border px-2 py-1">{s.quantity}</td>
              <td className="border px-2 py-1">
                {new Date(s.date_in).toLocaleString()}
              </td>
              <td className="border px-2 py-1">{s.manufacturer}</td>
              <td className="border px-2 py-1">{s.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
