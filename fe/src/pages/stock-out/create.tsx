"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Product { product_id: number; name: string; }
interface Warehouse { warehouse_id: number; name: string; }
interface Store { store_id: number; name: string; }

interface Inventory {
  warehouse_id: number;
  product_id: number;
  quantity: number;
}

export default function CreateStockOut() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [availableWarehouses, setAvailableWarehouses] = useState<Warehouse[]>([]);
  const [formData, setFormData] = useState({
    product_id: "",
    warehouse_id: "",
    quantity: 1,
    to_store: "",
    note: "",
  });

  useEffect(() => {
    axios.get<Product[]>("http://localhost:4001/products").then(res => setProducts(res.data));
    axios.get<Store[]>("http://localhost:4001/stores").then(res => setStores(res.data));
  }, []);

  // Khi chọn sản phẩm, gọi backend lấy kho còn tồn kho
  const handleProductChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = e.target.value;
    setFormData(prev => ({ ...prev, product_id: productId, warehouse_id: "" }));

    if (!productId) {
      setAvailableWarehouses([]);
      return;
    }

    try {
      const res = await axios.get<Inventory[]>(`http://localhost:4001/inventory?product_id=${productId}`);
      const whIds = res.data.filter(i => i.quantity > 0).map(i => i.warehouse_id);

      // Lấy thông tin tên kho
      const whRes = await axios.get<Warehouse[]>("http://localhost:4001/warehouses");
      const filtered = whRes.data.filter(w => whIds.includes(w.warehouse_id));
      setAvailableWarehouses(filtered);
    } catch (err) {
      console.error(err);
      setAvailableWarehouses([]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        product_id: Number(formData.product_id),
        warehouse_id: Number(formData.warehouse_id),
        quantity: Number(formData.quantity),
        to_store: formData.to_store ? Number(formData.to_store) : undefined,
        note: formData.note,
      };
      await axios.post("http://localhost:4001/stock-out", payload);
      alert("Tạo phiếu xuất thành công!");
      router.push("/stock-out/StockOutPage");
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra!");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <button className="mb-4 bg-gray-300 text-black px-3 py-2 rounded hover:bg-gray-400"
        onClick={() => router.push("/stock-out/StockOutPage")}>← Quay lại</button>

      <h2 className="text-2xl font-bold mb-4">Tạo phiếu xuất kho</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Sản phẩm */}
        <div>
          <label className="block mb-1 font-medium">Sản phẩm</label>
          <select name="product_id" value={formData.product_id} onChange={handleProductChange} className="w-full border rounded p-2" required>
            <option value="">-- Chọn sản phẩm --</option>
            {products.map(p => <option key={p.product_id} value={p.product_id}>{p.name}</option>)}
          </select>
        </div>

        {/* Kho */}
        <div>
          <label className="block mb-1 font-medium">Kho</label>
          <select name="warehouse_id" value={formData.warehouse_id} onChange={handleChange} className="w-full border rounded p-2" required>
            <option value="">-- Chọn kho --</option>
            {availableWarehouses.map(w => <option key={w.warehouse_id} value={w.warehouse_id}>{w.name}</option>)}
          </select>
        </div>

        {/* Số lượng */}
        <div>
          <label className="block mb-1 font-medium">Số lượng</label>
          <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full border rounded p-2" min={1} required />
        </div>

        {/* Store */}
        <div>
          <label className="block mb-1 font-medium">Cửa hàng</label>
          <select name="to_store" value={formData.to_store} onChange={handleChange} className="w-full border rounded p-2">
            <option value="">-- Chọn cửa hàng --</option>
            {stores.map(s => <option key={s.store_id} value={s.store_id}>{s.name}</option>)}
          </select>
        </div>

        {/* Ghi chú */}
        <div>
          <label className="block mb-1 font-medium">Ghi chú</label>
          <textarea name="note" value={formData.note} onChange={handleChange} className="w-full border rounded p-2" rows={3} />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Tạo phiếu xuất</button>
      </form>
    </div>
  );
}
