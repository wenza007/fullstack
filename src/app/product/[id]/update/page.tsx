'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import api from '../../../../lib/axios';
import { Product } from '../../../../types/product';

const BASIC_COLORS = [
  'black','white','red','green','blue','yellow',
  'orange','purple','pink','gray','brown','cyan',
];

export default function EditProduct({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [colors, setColors] = useState<string[]>([]);

  const [oldImage, setOldImage] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleColor = (c: string) => {
    setColors((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  useEffect(() => {
    if (!id) return;

    api
      .get<Product>(`/products/${id}`)
      .then((res) => {
        setName(res.data.name);
        setPrice(String(res.data.price));
        setDescription(res.data.description ?? '');
        setColors(res.data.color ?? []);

        if (res.data.imageUrl) {
          setOldImage(`${process.env.NEXT_PUBLIC_API_URL}/${res.data.imageUrl}`);
        }
      })
      .catch(() => {
        setError('❌ ไม่พบสินค้านี้');
        setTimeout(() => router.push('/product'), 1500);
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setNewImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', price);
      formData.append('description', description);

      colors.forEach((c) => formData.append('color[]', c));
      if (newImage) formData.append('image', newImage);

      await api.patch(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
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
      <div className="max-w-xl mx-auto">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 shadow-xl">

          <h1 className="text-3xl font-extrabold mb-8 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
            ✏️ แก้ไขสินค้า
          </h1>

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

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

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="รายละเอียดสินค้า"
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
                            ? 'bg-cyan-500 border-cyan-400 text-white'
                            : 'bg-black border-gray-600 text-gray-300 hover:border-cyan-400'
                        }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 🖼 IMAGE */}
            <div className="space-y-3">
              <label className="block text-gray-300 font-semibold">
                🖼 รูปสินค้า
              </label>

              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              <label
                htmlFor="image-upload"
                className="inline-block cursor-pointer px-4 py-2 rounded-xl
                           bg-gradient-to-r from-cyan-600 to-blue-600 hover:scale-105"
              >
                📤 เปลี่ยนรูป
              </label>

              {(preview || oldImage) && (
                <div className="mt-4 relative w-full aspect-[4/3] border border-gray-700 rounded-xl overflow-hidden">
                  <Image src={preview || oldImage!} alt="product" fill className="object-cover" unoptimized />
                </div>
              )}
            </div>

            <div className="flex justify-between pt-4 border-t border-white/10">
              <Link href="/product" className="text-gray-400 hover:text-white">
                ← ยกเลิก
              </Link>

              <button
                type="submit"
                disabled={saving}
                className={`px-6 py-2 rounded-xl font-semibold ${
                  saving
                    ? 'bg-gray-600'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105'
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
