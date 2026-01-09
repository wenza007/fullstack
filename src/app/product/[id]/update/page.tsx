'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../../../lib/axios';
import { Product } from '../../../../types/product';

export default function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // โหลดข้อมูลสินค้า
  useEffect(() => {
    api.get<Product>(`/products/${id}`)
      .then(res => {
        setName(res.data.name);
        setPrice(String(res.data.price));
        setDescription(res.data.description);
      })
      .catch(() => {
        setError('❌ ไม่พบสินค้านี้');
        setTimeout(() => router.push('/product'), 1500);
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  // บันทึกการแก้ไข
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await api.patch(`/products/${id}`, {
        name,
        price: Number(price),
        description,
      });
      router.push('/product');
    } catch (err: any) {
      setError(err.response?.data?.message ?? '❌ แก้ไขสินค้าไม่สำเร็จ');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-gray-400">
        กำลังโหลดข้อมูล...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-10 text-white">
      <div className="max-w-xl mx-auto relative">

        {/* Glow */}
        <div
          className="absolute inset-0 rounded-2xl
                     bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20
                     blur-xl -z-10"
        />

        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 shadow-xl">
          <h1
            className="text-3xl font-extrabold mb-8
                       bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400
                       bg-clip-text text-transparent"
          >
            ✏️ แก้ไขสินค้า
          </h1>

          {/* Alert Error */}
          {error && (
            <div
              className="mb-6 rounded-xl border border-red-500/40
                         bg-red-500/10 px-4 py-3 text-red-400"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 bg-black
                         border border-gray-600 rounded-lg
                         focus:border-cyan-400 focus:outline-none"
            />

            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full px-4 py-2 bg-black
                         border border-gray-600 rounded-lg
                         focus:border-green-400 focus:outline-none"
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 bg-black
                         border border-gray-600 rounded-lg
                         focus:border-purple-400 focus:outline-none"
            />

            <div className="flex justify-between pt-4 border-t border-white/10">
              <Link href="/product" className="text-gray-400 hover:text-white transition">
                ← ยกเลิก
              </Link>

              <button
                disabled={saving}
                className={`px-6 py-2 rounded-xl font-semibold transition
                  ${
                    saving
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 shadow-lg shadow-pink-500/30'
                  }`}
              >
                {saving ? 'กำลังบันทึก...' : '💾 บันทึก'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
