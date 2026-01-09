'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../../lib/axios';
import { Product } from '../../../types/product';

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    api.get<Product>(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => {
        alert('ไม่พบสินค้า');
        router.push('/product');
      });
  }, [id, router]);

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-10 text-white">
      <div className="max-w-3xl mx-auto bg-gray-900 border border-gray-700 rounded-2xl p-10">
        <h1 className="text-4xl font-extrabold mb-4
          bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400
          bg-clip-text text-transparent">
          {product.name}
        </h1>

        <p className="text-3xl text-green-400 font-bold mb-6">
          {product.price.toLocaleString()} บาท
        </p>

        <p className="text-gray-300 mb-10 leading-relaxed">
          {product.description}
        </p>

        <Link href="/product" className="text-cyan-400 hover:underline">
          ← กลับหน้ารายการสินค้า
        </Link>
      </div>
    </div>
  );
}
