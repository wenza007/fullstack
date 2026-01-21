//src/app/product/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import api from '../../lib/axios';
import { Product } from '../../types/product';

export default function ProductList() {
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // search & filter states
  const [q, setQ] = useState('');
  const [color, setColor] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState<'asc' | 'desc' | ''>('');

  // 🔹 load products
  useEffect(() => {
    api
      .get<Product[]>('/products')
      .then(res => {
        setProducts(res.data);
        setFiltered(res.data);
      })
      .catch(() => alert('โหลดข้อมูลไม่สำเร็จ'))
      .finally(() => setLoading(false));
  }, []);

  // 🔹 read query from Home (q=...)
  useEffect(() => {
    const query = searchParams.get('q');
    if (!query) return;

    const parts = query.split(' ');

    let _q = '';
    let _color = '';
    let _minPrice = '';
    let _maxPrice = '';
    let _sort: 'asc' | 'desc' | '' = '';

    parts.forEach(p => {
      if (p.startsWith('name:')) {
        _q = p.replace('name:', '');
      }

      if (p.startsWith('color:')) {
        _color = p.replace('color:', '');
      }

      if (/^\d+-\d+$/.test(p)) {
        const [min, max] = p.split('-');
        _minPrice = min;
        _maxPrice = max;
      }

      if (p === 'asc' || p === 'desc') {
        _sort = p;
      }
    });

    setQ(_q);
    setColor(_color);
    setMinPrice(_minPrice);
    setMaxPrice(_maxPrice);
    setSort(_sort);
  }, [searchParams]);

  // 🔹 filter + sort
  useEffect(() => {
    let result = [...products];

    if (q) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(q.toLowerCase())
      );
    }

    if (color) {
      result = result.filter(p =>
        p.color?.some(c => c.toLowerCase() === color)
      );
    }

    if (minPrice) {
      result = result.filter(p => p.price >= Number(minPrice));
    }

    if (maxPrice) {
      result = result.filter(p => p.price <= Number(maxPrice));
    }

    if (sort === 'asc') {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === 'desc') {
      result.sort((a, b) => b.price - a.price);
    }

    setFiltered(result);
  }, [q, color, minPrice, maxPrice, sort, products]);

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

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
            🎮 รายการสินค้า
          </h1>

          <div className="flex gap-4">
            <Link
              href="/"
              className="px-5 py-2 rounded-xl border border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10"
            >
              🏠 Home
            </Link>

            <Link
              href="/product/create"
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 font-semibold hover:scale-105 transition"
            >
              ➕ เพิ่มสินค้า
            </Link>
          </div>
        </div>

        {/* 🔍 Search + Filters */}
        <div className="mb-10 space-y-4">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ค้นหาชื่อสินค้า"
            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-gray-600 focus:border-cyan-400 outline-none"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <select
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="px-3 py-3 rounded-xl bg-black/40 border border-gray-600"
            >
              <option value="">🎨 ทุกสี</option>
              {['black', 'white', 'red', 'green', 'blue', 'yellow', 'orange', 'purple', 'pink', 'gray']
                .map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="ราคาต่ำสุด"
              className="px-3 py-3 rounded-xl bg-black/40 border border-gray-600"
            />

            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="ราคาสูงสุด"
              className="px-3 py-3 rounded-xl bg-black/40 border border-gray-600"
            />

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className="px-3 py-3 rounded-xl bg-black/40 border border-gray-600"
            >
              <option value="">↕️ เรียงราคา</option>
              <option value="asc">ถูก → แพง</option>
              <option value="desc">แพง → ถูก</option>
            </select>

            <button
              onClick={() => {
                setQ('');
                setColor('');
                setMinPrice('');
                setMaxPrice('');
                setSort('');
              }}
              className="px-4 py-3 rounded-xl border border-red-400/40 text-red-300 hover:bg-red-400/10"
            >
              ล้างตัวกรอง
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(p => {
            const imageSrc = p.imageUrl
              ? `${process.env.NEXT_PUBLIC_API_URL}/products/${p.imageUrl}`
              : null;

            return (
              <div
                key={p._id}
                className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden hover:border-cyan-400 hover:-translate-y-1 transition flex flex-col"
              >
                <div className="relative w-full aspect-[4/3] bg-black overflow-hidden">
                  {imageSrc ? (
                    <a
                      href={imageSrc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full h-full cursor-zoom-in"
                      title="คลิกเพื่อดูรูปขนาดเต็ม"
                    >
                      <Image
                        src={imageSrc}
                        alt={p.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                    </a>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      ไม่มีรูป
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h2 className="text-xl font-bold mb-2">
                    <Link
                      href={`/product/${p._id}`}
                      className="text-cyan-300 hover:underline"
                    >
                      {p.name}
                    </Link>
                  </h2>

                  <p className="text-gray-400 mb-4 line-clamp-2">
                    {p.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {p.color?.map((c, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 text-xs rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40"
                      >
                        {c}
                      </span>
                    ))}
                  </div>

                  <p className="text-2xl text-green-400 font-extrabold mb-6">
                    {p.price.toLocaleString()} บาท
                  </p>

                  <div className="flex justify-between mt-auto pt-4 border-t border-white/10">
                    <Link
                      href={`/product/${p._id}/update`}
                      className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-sm font-semibold"
                    >
                      ✏️ แก้ไข
                    </Link>

                    <Link
                      href={`/product/${p._id}/delete`}
                      className="px-4 py-1.5 rounded-lg text-sm bg-red-600 hover:bg-red-500"
                    >
                      ลบ
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <p className="text-gray-500 col-span-full">
              ❌ ไม่พบสินค้าที่ตรงตามเงื่อนไข
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
