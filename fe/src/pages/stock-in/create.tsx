"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

export default function CreateStockIn() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);

  const [formData, setFormData] = useState({
    product_id: "",
    warehouse_id: "",
    quantity: 1,
    from_manufacturer: "",
    note: "",
  });

  useEffect(() => {
    axios
      .get<Product[]>("http://localhost:4001/products")
      .then((res) => setProducts(res.data));
    axios
      .get<Warehouse[]>("http://localhost:4001/warehouses")
      .then((res) => setWarehouses(res.data));
    axios
      .get<Manufacturer[]>("http://localhost:4001/manufacturers")
      .then((res) => setManufacturers(res.data));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        product_id: Number(formData.product_id),
        warehouse_id: Number(formData.warehouse_id),
        quantity: Number(formData.quantity),
        from_manufacturer: formData.from_manufacturer
          ? Number(formData.from_manufacturer)
          : undefined,
        note: formData.note,
      };

      await axios.post("http://localhost:4001/stock-in", payload);
      alert("Tạo phiếu nhập thành công!");
      router.push("/stock-in"); // Quay về danh sách
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra!");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      {/* Button Quay lại */}
      <button
        className="mb-4 bg-gray-300 text-black px-3 py-2 rounded hover:bg-gray-400"
        onClick={() => router.push("/stock-in/StockInPage")}
      >
        ← Quay lại
      </button>

      <h2 className="text-2xl font-bold mb-4">Tạo phiếu nhập kho</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Chọn sản phẩm */}
        <div>
          <label className="block mb-1 font-medium">Sản phẩm</label>
          <select
            name="product_id"
            value={formData.product_id}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="">-- Chọn sản phẩm --</option>
            {products.map((p) => (
              <option key={p.product_id} value={p.product_id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Chọn kho */}
        <div>
          <label className="block mb-1 font-medium">Kho</label>
          <select
            name="warehouse_id"
            value={formData.warehouse_id}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="">-- Chọn kho --</option>
            {warehouses.map((w) => (
              <option key={w.warehouse_id} value={w.warehouse_id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>

        {/* Số lượng */}
        <div>
          <label className="block mb-1 font-medium">Số lượng</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full border rounded p-2"
            min={1}
            required
          />
        </div>

        {/* Nhà sản xuất */}
        <div>
          <label className="block mb-1 font-medium">Nhà sản xuất</label>
          <select
            name="from_manufacturer"
            value={formData.from_manufacturer}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="">-- Chọn nhà sản xuất --</option>
            {manufacturers.map((m) => (
              <option key={m.manufacturer_id} value={m.manufacturer_id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Ghi chú */}
        <div>
          <label className="block mb-1 font-medium">Ghi chú</label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            className="w-full border rounded p-2"
            rows={3}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Lưu phiếu nhập
        </button>
      </form>
    </div>
  );
}
