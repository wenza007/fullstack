'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../lib/axios';
import { Product } from '../../types/product';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Product[]>('/products')
      .then(res => setProducts(res.data))
      .catch(() => alert('โหลดข้อมูลไม่สำเร็จ'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-gray-400">
        กำลังโหลดข้อมูล...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-10 text-white">
      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-extrabold
            bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400
            bg-clip-text text-transparent">
            🎮 รายการสินค้า
          </h1>

          <div className="flex gap-4">
            <Link href="/" className="px-5 py-2 rounded-xl
              border border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10">
              🏠 Home
            </Link>

            <Link href="/product/create"
              className="px-6 py-2 rounded-xl
              bg-gradient-to-r from-purple-600 to-pink-600
              font-semibold hover:scale-105 transition
              shadow-lg shadow-pink-500/30">
              ➕ เพิ่มสินค้า
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map(p => (
            <div key={p.id}
              className="relative bg-gray-900 border border-gray-700
              rounded-2xl p-6 flex flex-col
              hover:border-cyan-400 hover:-translate-y-1 transition">

              <div className="absolute inset-0 rounded-2xl
                bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20
                blur-xl -z-10" />

              <h2 className="text-xl font-bold mb-2">
                <Link href={`/product/${p.id}`}
                  className="text-cyan-300 hover:underline">
                  {p.name}
                </Link>
              </h2>

              <p className="text-gray-400 mb-4 line-clamp-2">
                {p.description}
              </p>

              <p className="text-2xl text-green-400 font-extrabold mb-6">
                {p.price.toLocaleString()} บาท
              </p>

              <div className="flex justify-between mt-auto pt-4 border-t border-white/10">
                <Link href={`/product/${p.id}/update`}
                  className="px-4 py-1.5 rounded-lg
                  bg-gradient-to-r from-blue-500 to-cyan-500
                  text-sm font-semibold hover:scale-105 transition">
                  ✏️ แก้ไข
                </Link>

                <Link href={`/product/${p.id}/delete`}
                  className="px-4 py-1.5 rounded-lg text-sm
                  bg-red-600 hover:bg-red-500 transition">
                  ลบ
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
