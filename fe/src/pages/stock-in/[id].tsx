import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

interface Product {
  product_id: number;
  name: string;
}
interface Warehouse {
  warehouse_id: number;
  name: string;
}
interface Manufacturer {
  manufacturer_id: number;
  name: string;
}
interface StockIn {
  stock_in_id: number;
  product_id: number;
  warehouse_id: number;
  quantity: number;
  from_manufacturer: number;
  note: string;
}

export default function DetailStockIn() {
  const router = useRouter();
  const { id } = router.query;

  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);

  const [formData, setFormData] = useState<StockIn>({
    stock_in_id: 0,
    product_id: 0,
    warehouse_id: 0,
    quantity: 1,
    from_manufacturer: 0,
    note: "",
  });

  useEffect(() => {
    if (id) {
      axios
        .get<StockIn>(`http://localhost:4001/stock-in/${id}`)
        .then((res) => setFormData(res.data));
    }

    axios
      .get<Product[]>("http://localhost:4001/products")
      .then((res) => setProducts(res.data));
    axios
      .get<Warehouse[]>("http://localhost:4001/warehouses")
      .then((res) => setWarehouses(res.data));
    axios
      .get<Manufacturer[]>("http://localhost:4001/manufacturers")
      .then((res) => setManufacturers(res.data));
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: ["product_id", "warehouse_id", "from_manufacturer"].includes(name)
        ? Number(value) // Ép kiểu number cho select
        : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.put(`http://localhost:4001/stock-in/${id}`, {
      ...formData,
      product_id: Number(formData.product_id),
      warehouse_id: Number(formData.warehouse_id),
      quantity: Number(formData.quantity),
      from_manufacturer: Number(formData.from_manufacturer),
    });

    router.push("/stock-in/StockInPage");
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sửa phiếu nhập</h1>
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
          name="from_manufacturer"
          value={formData.from_manufacturer}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          {manufacturers.map((m) => (
            <option key={m.manufacturer_id} value={m.manufacturer_id}>
              {m.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="note"
          value={formData.note}
          onChange={handleChange}
          className="w-full border p-2 rounded"
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
