// src/types/product.ts
export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  color: string[];   // 👈 เพิ่ม
  imageUrl: string;
}
