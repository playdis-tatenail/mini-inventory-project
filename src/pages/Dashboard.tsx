import type { Product } from '../types';
import { Link } from 'react-router-dom';

interface DashboardProps {
  products: Product[];
  loading?: boolean;
  error?: string | null;
}

const Dashboard = ({ products, loading, error }: DashboardProps) => {
  const totalItems = products.length;
  const totalQuantity = products.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = products.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const outOfStockItems = products.filter((item) => item.quantity === 0);
  const lowStockItems = products.filter((item) => item.quantity > 0 && item.quantity <= 10);

  return (
    <div className="min-h-screen from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-slate-500 text-sm">ภาพรวมระบบจัดการสินค้าคงคลัง</p>
          </div>
          <Link to="/products">
            <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow hover:bg-blue-700 hover:scale-105 transition-all duration-200 cursor-pointer">
              + เพิ่มสินค้าใหม่
            </button>
          </Link>
        </header>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6 text-sm">
            ⚠️ เชื่อมต่อ API ไม่สำเร็จ: {error}
          </div>
        )}

        {/* Inventory Overview Banner */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6 rounded-3xl shadow-xl text-white mb-10">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm opacity-80">Inventory Overview</p>
              <h2 className="text-2xl font-bold">{products.length} รายการสินค้า</h2>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 max-h-64 overflow-y-auto">
            {loading ? (
              <p className="text-center opacity-70 py-6">กำลังโหลดข้อมูล...</p>
            ) : products.length > 0 ? (
              products.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-2 border-b border-white/20 last:border-none"
                >
                  <span className="font-medium">{item.name}</span>
                  <div className="flex gap-4 text-sm opacity-90 items-center">
                    {/* เพิ่มการแสดงราคาในลิสต์ */}
                    <span className="text-yellow-300 font-bold">{item.price.toLocaleString()} ฿</span>
                    <span className="bg-white/20 px-2 py-0.5 rounded text-xs">{item.quantity} ชิ้น</span>
                    <span className="opacity-60 text-xs hidden md:inline">โซน {item.zone} ({item.sku})</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center opacity-70 py-6">ยังไม่มีสินค้าในระบบ</p>
            )}
          </div>
        </div>

        {/* Stats Cards (ปรับเป็น 4 คอลัมน์เพื่อรองรับ Card มูลค่ารวม) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          {/* Card 1: Total Items */}
          <div className="group bg-white/70 backdrop-blur-lg p-6 rounded-3xl shadow-md border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl text-2xl">📦</div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Total Items</span>
            </div>
            <p className="text-slate-500 text-sm">ชนิดสินค้า</p>
            <h2 className="text-3xl font-bold text-slate-800 mt-2">{totalItems.toLocaleString()} <span className="text-base text-slate-400 font-normal">ชนิด</span></h2>
          </div>

          {/* Card 2: Total Quantity */}
          <div className="group bg-white/70 backdrop-blur-lg p-6 rounded-3xl shadow-md border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl text-2xl">🏷️</div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">Total Stock</span>
            </div>
            <p className="text-slate-500 text-sm">จำนวนชิ้นรวม</p>
            <h2 className="text-3xl font-bold text-slate-800 mt-2">{totalQuantity.toLocaleString()} <span className="text-base text-slate-400 font-normal">ชิ้น</span></h2>
          </div>

          {/* Card 3: Inventory Value (ส่วนที่เพิ่มใหม่) */}
          <div className="group bg-white/70 backdrop-blur-lg p-6 rounded-3xl shadow-md border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl text-2xl">💰</div>
              <span className="text-xs font-semibold text-amber-600 bg-amber-100 px-2 py-1 rounded-full">Total Value</span>
            </div>
            <p className="text-slate-500 text-sm">มูลค่าคลังรวม</p>
            <h2 className="text-2xl font-bold text-slate-800 mt-2">{totalValue.toLocaleString()} <span className="text-base text-slate-400 font-normal">฿</span></h2>
          </div>

          {/* Card 4: Out of Stock */}
          <div className="group bg-white/70 backdrop-blur-lg p-6 rounded-3xl shadow-md border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl text-2xl">⚠️</div>
              <span className="text-xs font-semibold text-rose-600 bg-rose-100 px-2 py-1 rounded-full">Out of Stock</span>
            </div>
            <p className="text-slate-500 text-sm">สินค้าหมด</p>
            <h2 className="text-3xl font-bold text-rose-500 mt-2">{outOfStockItems.length} <span className="text-base text-slate-400 font-normal">รายการ</span></h2>
          </div>

        </div>

        {/* Lower Sections (Low stock / Out of stock) - คงเดิมตาม UI ของ Jem */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* สินค้าใกล้หมด */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-md border border-slate-200 overflow-hidden">
            <div className="p-6 flex justify-between items-center border-b bg-slate-50/50">
              <h2 className="font-bold text-slate-700 text-lg">🟡 สินค้าใกล้หมด (≤ 10)</h2>
              <span className="text-xs text-slate-500">พบ {lowStockItems.length} รายการ</span>
            </div>
            <div className="p-6">
              {lowStockItems.length > 0 ? (
                <div className="space-y-3">
                  {lowStockItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-4 rounded-xl bg-yellow-50 border border-yellow-100">
                      <div>
                        <span className="font-medium text-slate-700">{item.name}</span>
                        <p className="text-xs text-slate-400">SKU: {item.sku} · โซน {item.zone}</p>
                      </div>
                      <span className="text-xs font-bold text-yellow-700 bg-white px-3 py-1 rounded-lg border border-yellow-200">
                        เหลือ {item.quantity} ชิ้น
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-400 py-6 italic">✨ ยังไม่มีสินค้าใกล้หมด</p>
              )}
            </div>
          </div>

          {/* สินค้าหมดสต็อก */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-md border border-slate-200 overflow-hidden">
            <div className="p-6 flex justify-between items-center border-b bg-slate-50/50">
              <h2 className="font-bold text-slate-700 text-lg">🚨 สินค้าหมดสต็อก</h2>
              <span className="text-xs text-slate-500">พบ {outOfStockItems.length} รายการ</span>
            </div>
            <div className="p-6">
              {outOfStockItems.length > 0 ? (
                <div className="space-y-3">
                  {outOfStockItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-4 rounded-xl bg-rose-50 border border-rose-100">
                      <div>
                        <span className="font-medium text-slate-700">{item.name}</span>
                        <p className="text-xs text-slate-400">SKU: {item.sku} · โซน {item.zone}</p>
                      </div>
                      <span className="text-xs font-bold text-rose-600 bg-white px-3 py-1 rounded-lg border">สินค้าหมด</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-400 py-6 italic">✨ เยี่ยม! สต็อกยังแน่นทุกรายการ</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
