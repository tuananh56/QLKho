import axios from "axios";

export interface Product {
  product_id: number;
  name: string;
  unit?: string;
}

// Dùng generic của axios để TypeScript hiểu kiểu trả về
export const getAllProducts = async (): Promise<Product[]> => {
  const res = await axios.get<Product[]>("http://localhost:4001/products");
  return res.data;
};
