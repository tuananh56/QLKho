"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // ✅ dùng navigation thay vì next/router
import axios from "axios";

interface Product {
  product_id: number;
  name: string;
}

interface Warehouse {
  warehouse_id: number;
  name: string;
}

interface Store {
  store_id: number;
  name: string;
}

interface StockOut {
  stock_out_id: number;
  product_id: number;
  warehouse_id: number;
  quantity: number;
  to_store?: number | null;
  note?: string;
}

export default function DetailStockOut({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [formData, setFormData] = useState<StockOut>({
    stock_out_id: 0,
    product_id: 0,
    warehouse_id: 0,
    quantity: 1,
    to_store: undefined,
    note: "",
  });

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [stockRes, productsRes, warehousesRes, storesRes] =
          await Promise.all([
            axios.get<StockOut>(`http://localhost:4001/stock-out/${id}`),
            axios.get<Product[]>(`http://localhost:4001/products`),
            axios.get<Warehouse[]>(`http://localhost:4001/warehouses`),
            axios.get<Store[]>(`http://localhost:4001/stores`),
          ]);

        setProducts(productsRes.data);
        setWarehouses(warehousesRes.data);
        setStores(storesRes.data);
        setFormData(stockRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: ["product_id", "warehouse_id", "to_store"].includes(name)
        ? Number(value)
        : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:4001/stock-out/${id}`, {
        ...formData,
        product_id: Number(formData.product_id),
        warehouse_id: Number(formData.warehouse_id),
        quantity: Number(formData.quantity),
        to_store: formData.to_store ? Number(formData.to_store) : null,
      });

      // ✅ quay lại StockOutPage sau khi cập nhật thành công
      router.push("http://localhost:4000/stock-out/StockOutPage");
    } catch (err) {
      console.error("Cập nhật thất bại:", err);
      alert("Cập nhật thất bại");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Sửa phiếu xuất: {formData.stock_out_id || id}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="product_id"
          value={formData.product_id}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          {products.map((p) => (
            <option key={p.product_id} value={p.product_id}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          name="warehouse_id"
          value={formData.warehouse_id}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          {warehouses.map((w) => (
            <option key={w.warehouse_id} value={w.warehouse_id}>
              {w.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          min={1}
          required
        />

        <select
          name="to_store"
          value={formData.to_store ?? ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">-- Chọn cửa hàng --</option>
          {stores.map((s) => (
            <option key={s.store_id} value={s.store_id}>
              {s.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="note"
          value={formData.note ?? ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Ghi chú"
        />

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Cập nhật
        </button>
      </form>
    </div>
  );
}
