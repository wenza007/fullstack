'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../../lib/axios';

export default function CreateProduct() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post('/products', {
        name,
        price: Number(price),
        description,
      });
      router.push('/product');
    } catch (err: any) {
      setError(err.response?.data?.message ?? '❌ บันทึกสินค้าไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

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
            ➕ เพิ่มสินค้าใหม่
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
              placeholder="ชื่อสินค้า"
              required
              className="w-full px-4 py-2 bg-black
                         border border-gray-600 rounded-lg
                         focus:border-cyan-400 focus:outline-none"
            />

            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="ราคา"
              required
              className="w-full px-4 py-2 bg-black
                         border border-gray-600 rounded-lg
                         focus:border-green-400 focus:outline-none"
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="รายละเอียด"
              className="w-full px-4 py-2 bg-black
                         border border-gray-600 rounded-lg
                         focus:border-purple-400 focus:outline-none"
            />

            <div className="flex justify-between pt-4 border-t border-white/10">
              <Link href="/product" className="text-gray-400 hover:text-white transition">
                ← ยกเลิก
              </Link>

              <button
                disabled={loading}
                className={`px-6 py-2 rounded-xl font-semibold transition
                  ${
                    loading
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 shadow-lg shadow-pink-500/30'
                  }`}
              >
                {loading ? 'กำลังบันทึก...' : '💾 บันทึก'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
