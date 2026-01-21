'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import api from '../../../lib/axios';
import { Product } from '../../../types/product';

export default function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    api
      .get<Product>(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => {
        setTimeout(() => router.push('/product'), 1500);
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-gray-400">
        กำลังโหลดข้อมูล...
      </div>
    );
  }

  if (!product) return null;

  const imageSrc = product.imageUrl
    ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${product.imageUrl}`
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-10 text-white">
      <div className="max-w-xl mx-auto relative">

        {/* Glow */}
        <div
          className="absolute inset-0 rounded-2xl
                     bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20
                     blur-xl -z-10"
        />

        {/* Card */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 shadow-xl space-y-6">

          {/* 🖼️ IMAGE */}
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-black">
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
                  alt={product.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
              </a>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                ไม่มีรูปสินค้า
              </div>
            )}
          </div>

          {/* Title */}
          <h1
            className="text-3xl font-extrabold
                       bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500
                       bg-clip-text text-transparent"
          >
            {product.name}
          </h1>

          {/* Price */}
          <div className="text-xl font-semibold text-green-400">
            💰 ราคา {product.price.toLocaleString()} บาท
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-gray-300 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* 🎨 COLORS */}
          <div>
            <h3 className="mb-2 font-semibold text-gray-300">
              🎨 สีสินค้า
            </h3>

            {product.color && product.color.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {product.color.map((c, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-sm
                               bg-white/10 border border-white/20
                               text-white"
                  >
                    {c}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-sm">
                ไม่มีข้อมูลสี
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between pt-6 border-t border-white/10">
            <Link
              href="/product"
              className="text-gray-400 hover:text-white transition"
            >
              ← กลับ
            </Link>

            <Link
              href={`/product/${product._id}/update`}
              className="px-5 py-2 rounded-xl font-semibold
                         bg-gradient-to-r from-purple-600 to-pink-600
                         hover:scale-105 transition
                         shadow-lg shadow-pink-500/30"
            >
              ✏️ แก้ไข
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
