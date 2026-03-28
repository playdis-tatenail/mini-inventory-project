import type { Product } from "../types";
import { Link } from "react-router-dom";

interface DashboardProps {
  products: Product[];
}

const Dashboard = ({ products }: DashboardProps) => {
  const totalItems = products.length;
  const totalValue = products.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const outOfStockItems = products.filter(item => item.quantity === 0);

  return (
    <div className="min-h-screen  from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-slate-500 text-sm">Overview of your inventory</p>
          </div>

            <Link to="/products">
              <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow hover:bg-blue-700 hover:scale-105 transition-all duration-200 cursor-pointer">
                + Add Product
              </button>
            </Link>
        </header>
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6 rounded-3xl shadow-xl text-white mb-10">

          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm opacity-80">Inventory Overview</p>
              <h2 className="text-2xl font-bold">
                {products.length} Items
              </h2>
            </div>
          </div>

          {/* Content (Scrollable List) */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 max-h-64 overflow-y-auto">

            {products.length > 0 ? (
              products.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b border-white/20 last:border-none"
                >
                  <span className="font-medium">{item.name}</span>

                  <div className="flex gap-4 text-sm opacity-90">
                    <span>{item.quantity} ชิ้น</span>
                    <span>{item.price} ฿</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center opacity-70 py-6">
                ยังไม่มีสินค้า
              </p>
            )}

          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

          {/* Card */}
          <div className="group bg-white/70 backdrop-blur-lg p-6 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl text-2xl group-hover:scale-110 transition">
                📦
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                Total Items
              </span>
            </div>
            <p className="text-slate-500 text-sm">จำนวนรายการสินค้า</p>
            <h2 className="text-3xl font-bold text-slate-800 mt-2">
              {totalItems.toLocaleString()}{" "}
              <span className="text-base text-slate-400">ชนิด</span>
            </h2>
          </div>

          {/* Card */}
          <div className="group bg-white/70 backdrop-blur-lg p-6 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl text-2xl group-hover:scale-110 transition">
                💰
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                Inventory Value
              </span>
            </div>
            <p className="text-slate-500 text-sm">มูลค่ารวมของสต๊อก</p>
            <h2 className="text-3xl font-bold text-slate-800 mt-2">
              {totalValue.toLocaleString()}{" "}
              <span className="text-base text-slate-400">บาท</span>
            </h2>
          </div>

          {/* Card */}
          <div className="group bg-white/70 backdrop-blur-lg p-6 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl text-2xl group-hover:scale-110 transition">
                ⚠️
              </div>
              <span className="text-xs font-semibold text-rose-600 bg-rose-100 px-2 py-1 rounded-full">
                Out of Stock
              </span>
            </div>
            <p className="text-slate-500 text-sm">สินค้าที่ของหมด</p>
            <h2 className="text-3xl font-bold text-rose-500 mt-2">
              {outOfStockItems.length} รายการ
            </h2>
          </div>
        </div>

        {/* Low Stock Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-md border border-slate-200 overflow-hidden">
          
          {/* Header */}
          <div className="p-6 flex justify-between items-center border-b bg-slate-50/50">
            <h2 className="font-bold text-slate-700 text-lg">
              🚨 สินค้าตรวจสอบด่วน
            </h2>
            <span className="text-xs text-slate-500">
              พบ {outOfStockItems.length} รายการ
            </span>
          </div>

          {/* Content */}
          <div className="p-6">
            {outOfStockItems.length > 0 ? (
              <div className="space-y-3">
                {outOfStockItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 rounded-xl bg-rose-50 border border-rose-100 hover:shadow-sm transition"
                  >
                    <span className="font-medium text-slate-700">
                      {item.name}
                    </span>
                    <span className="text-xs font-bold text-rose-600 bg-white px-3 py-1 rounded-lg border">
                      สินค้าหมด
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-400 py-6 italic">
                ✨ ยอดเยี่ยม! ยังไม่มีสินค้าหมดสต๊อก
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;