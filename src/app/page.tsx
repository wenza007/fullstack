import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-gradient-to-br from-black via-gray-900 to-black
                    text-white">

      <div className="max-w-3xl w-full text-center p-10 relative">

        {/* Glow background */}
        <div
          className="absolute inset-0 rounded-3xl
                     bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20
                     blur-2xl -z-10"
        />

        {/* Card */}
        <div className="bg-gray-900/90 border border-gray-700 rounded-3xl p-12 shadow-2xl">

          <h1
            className="text-5xl font-extrabold mb-6
                       bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400
                       bg-clip-text text-transparent"
          >
            🎮 Gaming Product Manager
          </h1>

          <p className="text-gray-400 text-lg mb-10">
            ระบบจัดการสินค้าเกมมิ่ง  
            เพิ่ม แก้ไข ลบ และดูรายละเอียดสินค้าได้ง่าย ๆ
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/product"
              className="px-8 py-3 rounded-xl
                         bg-gradient-to-r from-purple-600 to-pink-600
                         font-semibold text-lg
                         hover:scale-105 transition
                         shadow-lg shadow-pink-500/30"
            >
              🛒 ดูรายการสินค้า
            </Link>

            <Link
              href="/product/create"
              className="px-8 py-3 rounded-xl
                         border border-cyan-400/50
                         text-cyan-300 font-semibold text-lg
                         hover:bg-cyan-400/10
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
