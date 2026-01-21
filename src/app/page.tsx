'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const BASIC_COLORS = [
  'black', 'white', 'red', 'green', 'blue',
  'yellow', 'orange', 'purple', 'pink', 'gray',
];

export default function Home() {
  const router = useRouter();

  const [q, setQ] = useState('');
  const [color, setColor] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState<'asc' | 'desc' | ''>('');

 const onSearch = (e: React.FormEvent) => {
  e.preventDefault();

  const parts: string[] = [];

  if (q) parts.push(`name:${q}`);
  if (color) parts.push(`color:${color}`);
  if (minPrice && maxPrice) parts.push(`${minPrice}-${maxPrice}`);
  if (sort) parts.push(sort);

  const searchText = parts.join(' ');
  router.push(`/product?q=${encodeURIComponent(searchText)}`);
};


  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-gradient-to-br from-black via-gray-900 to-black
                    text-white">

      <div className="max-w-4xl w-full p-10 relative">

        {/* Glow */}
        <div
          className="absolute inset-0 rounded-3xl
                     bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20
                     blur-2xl -z-10"
        />

        <div className="bg-gray-900/90 border border-gray-700 rounded-3xl p-12 shadow-2xl">

          <h1 className="text-5xl font-extrabold mb-8 text-center
                         bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400
                         bg-clip-text text-transparent">
            🎮 Gaming Product Manager
          </h1>

          {/* 🔍 SEARCH + FILTER */}
          <form onSubmit={onSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-10">

            {/* keyword */}
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ค้นหาชื่อสินค้า"
              className="md:col-span-2 px-4 py-3 rounded-xl
                         bg-black/40 border border-gray-600
                         focus:border-cyan-400 outline-none"
            />

            {/* color */}
            <select
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="px-3 py-3 rounded-xl bg-black/40 border border-gray-600"
            >
              <option value="">🎨 ทุกสี</option>
              {BASIC_COLORS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* min price */}
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="ราคาต่ำสุด"
              className="px-3 py-3 rounded-xl bg-black/40 border border-gray-600"
            />

            {/* max price */}
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="ราคาสูงสุด"
              className="px-3 py-3 rounded-xl bg-black/40 border border-gray-600"
            />

            {/* sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className="px-3 py-3 rounded-xl bg-black/40 border border-gray-600 md:col-span-2"
            >
              <option value="">↕️ เรียงราคา</option>
              <option value="asc">ถูก → แพง</option>
              <option value="desc">แพง → ถูก</option>
            </select>

            {/* submit */}
            <button
              type="submit"
              className="md:col-span-3 px-8 py-3 rounded-xl
                         bg-gradient-to-r from-purple-600 to-pink-600
                         font-semibold text-lg
                         hover:scale-105 transition"
            >
              🔍 ค้นหาสินค้า
            </button>
          </form>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/product"
              className="px-8 py-3 rounded-xl
                         border border-cyan-400/50
                         text-cyan-300 font-semibold text-lg
                         hover:bg-cyan-400/10"
            >
              🛒 ดูสินค้าทั้งหมด
            </Link>

            <Link
              href="/product/create"
              className="px-8 py-3 rounded-xl
                         bg-gradient-to-r from-purple-600 to-pink-600
                         font-semibold text-lg
                         hover:scale-105 transition"
            >
              ➕ เพิ่มสินค้าใหม่
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
