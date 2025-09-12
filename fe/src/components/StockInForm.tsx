// components/StockInForm.tsx
"use client";
import { useState, useEffect } from "react";
import { StockInItem } from "../pages/stock-in/StockInPage";

interface Props {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  editingItem: StockInItem | null;
}

export default function StockInForm({ show, onClose, onSubmit, editingItem }: Props) {
  const [animate, setAnimate] = useState(false);
  const [formData, setFormData] = useState({
    product_id: "",
    warehouse_id: "",
    quantity: 1,
    from_manufacturer: "",
    note: "",
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({
        product_id: editingItem.product,
        warehouse_id: editingItem.warehouse ?? "",
        quantity: editingItem.quantity,
        from_manufacturer: editingItem.manufacturer ?? "",
        note: editingItem.note ?? "",
      });
    } else {
      setFormData({
        product_id: "",
        warehouse_id: "",
        quantity: 1,
        from_manufacturer: "",
        note: "",
      });
    }
  }, [editingItem]);

  useEffect(() => {
    if (show) {
      setTimeout(() => setAnimate(true), 50);
    } else {
      setAnimate(false);
    }
  }, [show]);

  if (!show) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black z-50 transition-opacity duration-300 ${
        animate ? "bg-opacity-50" : "bg-opacity-0"
      }`}
      onClick={onClose}
    >
      <form
        className={`bg-white p-6 rounded shadow-md w-96 transform transition-all duration-300 ${
          animate ? "scale-100 translate-y-0" : "scale-90 -translate-y-6"
        }`}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold mb-4">
          {editingItem ? "Sửa phiếu nhập" : "Thêm phiếu nhập"}
        </h2>
        <input
          className="border p-2 w-full mb-2"
          placeholder="Product ID"
          value={formData.product_id}
          onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
          required
        />
        <input
          className="border p-2 w-full mb-2"
          placeholder="Warehouse ID"
          value={formData.warehouse_id}
          onChange={(e) => setFormData({ ...formData, warehouse_id: e.target.value })}
          required
        />
        <input
          className="border p-2 w-full mb-2"
          type="number"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
          required
        />
        <input
          className="border p-2 w-full mb-2"
          placeholder="Manufacturer ID"
          value={formData.from_manufacturer}
          onChange={(e) => setFormData({ ...formData, from_manufacturer: e.target.value })}
        />
        <input
          className="border p-2 w-full mb-2"
          placeholder="Ghi chú"
          value={formData.note}
          onChange={(e) => setFormData({ ...formData, note: e.target.value })}
        />
        <div className="flex justify-end gap-2 mt-4">
          <button type="button" className="px-3 py-2 border rounded" onClick={onClose}>
            Hủy
          </button>
          <button type="submit" className="px-3 py-2 bg-blue-500 text-white rounded">
            {editingItem ? "Cập nhật" : "Thêm"}
          </button>
        </div>
      </form>
    </div>
  );
}
