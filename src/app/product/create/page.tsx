'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import api from '../../../lib/axios';

const BASIC_COLORS = [
  'black','white','red','green','blue','yellow',
  'orange','purple','pink','gray','brown','cyan',
];

export default function CreateProduct() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  // ✅ ใช้ array แทน string
  const [colors, setColors] = useState<string[]>([]);

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleColor = (c: string) => {
    setColors((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', String(Number(price)));
      formData.append('description', description);

      colors.forEach((c) => formData.append('color[]', c));

      if (image) {
        formData.append('image', image);
      }

      await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
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
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 blur-xl -z-10" />

        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 shadow-xl">
          <h1 className="text-3xl font-extrabold mb-8 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
            ➕ เพิ่มสินค้าใหม่
          </h1>

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 🖼 Image */}
            <div>
              <label className="block mb-2 font-semibold text-gray-300">
                📷 รูปสินค้า
              </label>

              <div className="flex items-center gap-4">
                <label className="cursor-pointer px-4 py-2 rounded-lg bg-black border border-gray-600 hover:border-cyan-400">
                  เลือกรูป
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {preview && (
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-600">
                    <Image src={preview} alt="preview" fill className="object-cover" unoptimized />
                  </div>
                )}
              </div>
            </div>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="ชื่อสินค้า"
              className="w-full px-4 py-2 bg-black border border-gray-600 rounded-lg"
            />

            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              placeholder="ราคา"
              className="w-full px-4 py-2 bg-black border border-gray-600 rounded-lg"
            />

            {/* 🎨 COLORS */}
            <div>
              <label className="block mb-2 font-semibold text-gray-300">
                🎨 สีสินค้า
              </label>

              <div className="flex flex-wrap gap-2">
                {BASIC_COLORS.map((c) => {
                  const active = colors.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleColor(c)}
                      className={`px-4 py-1 rounded-full text-sm border transition
                        ${
                          active
                            ? 'bg-pink-500 border-pink-400 text-white'
                            : 'bg-black border-gray-600 text-gray-300 hover:border-pink-400'
                        }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="รายละเอียดสินค้า"
              className="w-full px-4 py-2 bg-black border border-gray-600 rounded-lg"
            />

            <div className="flex justify-between pt-4 border-t border-white/10">
              <Link href="/product" className="text-gray-400 hover:text-white">
                ← ยกเลิก
              </Link>

              <button
                disabled={loading}
                className={`px-6 py-2 rounded-xl font-semibold ${
                  loading
                    ? 'bg-gray-600'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105'
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
