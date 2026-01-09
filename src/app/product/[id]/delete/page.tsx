'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../../../lib/axios';
import { Product } from '../../../../types/product';

export default function DeleteProduct({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  // โหลดข้อมูลสินค้า (axios)
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get<Product>(`/products/${id}`);
        setProduct(res.data);
      } catch {
        alert('ไม่พบสินค้านี้');
        router.push('/product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, router]);

  // ลบสินค้า (axios)
  const handleDelete = async () => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?')) return;

    setDeleting(true);
    try {
      await api.delete(`/products/${id}`);
      router.push('/product');
    } catch {
      alert('ลบสินค้าไม่สำเร็จ');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-gray-400">
        กำลังโหลดข้อมูล...
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-10 text-white">
      <div className="max-w-xl mx-auto relative">

        {/* Glow แดง */}
        <div
          className="absolute inset-0 rounded-2xl
                     bg-gradient-to-r from-red-500/20 via-orange-500/20 to-pink-500/20
                     blur-xl -z-10"
        ></div>

        {/* Card */}
        <div className="bg-gray-900 border border-red-700 rounded-2xl p-8 shadow-xl">
          <h1
            className="text-3xl font-extrabold mb-6
                       bg-gradient-to-r from-red-500 via-orange-400 to-pink-500
                       bg-clip-text text-transparent"
          >
            ⚠️ ยืนยันการลบสินค้า
          </h1>

          <p className="text-gray-300 mb-6">
            คุณกำลังจะลบสินค้าดังต่อไปนี้:
          </p>

          {/* Product Info */}
          <div className="bg-black/50 rounded-xl p-4 border border-gray-700 mb-6">
            <p className="text-lg font-semibold text-white">
              {product.name}
            </p>
            <p className="text-gray-400">
              ราคา: {product.price.toLocaleString()} บาท
            </p>
            <p className="text-gray-400 mt-2">
              {product.description || 'ไม่มีรายละเอียด'}
            </p>
          </div>

          {/* Warning */}
          <div className="mb-6 rounded-lg border border-red-500/50
                          bg-red-500/10 px-4 py-3 text-red-400">
            ⚠️ การลบสินค้าไม่สามารถกู้คืนได้
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t border-white/10">
            <Link
              href="/product"
              className="text-gray-400 hover:text-white transition"
            >
              ← ยกเลิก
            </Link>

            <button
              onClick={handleDelete}
              disabled={deleting}
              className={`px-6 py-2 rounded-xl font-semibold transition
                ${
                  deleting
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-600 to-pink-600 hover:scale-105 shadow-lg shadow-red-500/30'
                }`}
            >
              {deleting ? 'กำลังลบ...' : '🗑️ ลบสินค้า'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
