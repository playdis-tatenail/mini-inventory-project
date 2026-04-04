import { useState } from 'react';
import { useInventory } from '../hooks/useInventory';

interface Props {
  inventory: ReturnType<typeof useInventory>;
}

const ProductManagement = ({ inventory }: Props) => {
  const {
    filteredProducts,
    searchTerm,
    setSearchTerm,
    addProduct,
    updateQuantity,
    deleteProduct,
    loading,
  } = inventory;

  // State สำหรับฟอร์ม (ตาม schema จริง)
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [zone, setZone] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !sku.trim() || !zone.trim()) {
      return alert('กรุณากรอกชื่อสินค้า, SKU และโซนให้ครบถ้วน');
    }
    addProduct(name.trim(), sku.trim(), zone.trim(), quantity, price);
    setName(''); setSku(''); setZone(''); setQuantity(0); setPrice(0);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Product Management</h2>

      {/* ช่องค้นหา */}
      <input
        type="text"
        placeholder="🔍 ค้นหาสินค้า (ชื่อ, SKU, โซน)..."
        className="w-full p-2 mb-6 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* ฟอร์มเพิ่มสินค้า */}
      <form
        className="bg-white p-6 rounded-xl shadow-md flex flex-wrap gap-4 mb-10"
        onSubmit={handleSubmit}
      >
        {/* ชื่อสินค้า */}
        <div className="flex flex-col flex-1 min-w-[140px]">
          <label className="text-sm text-slate-600 mb-1">ชื่อสินค้า</label>
          <input
            type="text"
            placeholder="เช่น Coca-Cola"
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* SKU */}
        <div className="flex flex-col min-w-[120px]">
          <label className="text-sm text-slate-600 mb-1">SKU</label>
          <input
            type="text"
            placeholder="เช่น CC-001"
            className="border p-2 rounded w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
          />
        </div>

        {/* โซน */}
        <div className="flex flex-col min-w-[100px]">
          <label className="text-sm text-slate-600 mb-1">โซน</label>
          <input
            type="text"
            placeholder="เช่น A1"
            className="border p-2 rounded w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={zone}
            onChange={(e) => setZone(e.target.value)}
          />
        </div>

        {/* ราคา */}
        <div className="flex flex-col">
          <label className="text-sm text-slate-600 mb-1">ราคา (บาท)</label>
          <input
            type="number"
            placeholder="0"
            min="0"
            className="border p-2 rounded w-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={price === 0 ? '' : price}
            onChange={(e) => {
              const val = e.target.value;
              if (val === '') { setPrice(0); }
              else { const num = Number(val); setPrice(num < 0 ? 0 : num); }
            }}
          />
        </div>

        {/* จำนวน */}
        <div className="flex flex-col">
          <label className="text-sm text-slate-600 mb-1">จำนวน</label>
          <input
            type="number"
            placeholder="0"
            min="0"
            className="border p-2 rounded w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={quantity === 0 ? '' : quantity}
            onChange={(e) => {
              const val = e.target.value;
              if (val === '') { setQuantity(0); }
              else { const num = Number(val); setQuantity(num < 0 ? 0 : num); }
            }}
          />
        </div>

        {/* ปุ่ม */}
        <div className="flex items-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md font-bold hover:bg-blue-700 transition cursor-pointer"
          >
            เพิ่ม
          </button>
        </div>
      </form>

      {/* Loading */}
      {loading && (
        <p className="text-center text-slate-400 py-10">กำลังโหลด...</p>
      )}

      {/* รายการสินค้า */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`p-6 rounded-2xl shadow-sm border-2 ${
                product.quantity === 0
                  ? 'bg-red-50 border-red-200'
                  : product.quantity <= 10
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-white border-transparent'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-xl font-bold">{product.name}</h3>
                {product.quantity <= 10 && product.quantity > 0 && (
                  <span className="text-xs font-semibold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">
                    ใกล้หมด
                  </span>
                )}
                {product.quantity === 0 && (
                  <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                    หมดสต็อก
                  </span>
                )}
              </div>

              <p className="text-gray-400 text-sm mb-0.5">SKU: {product.sku}</p>
              <p className="text-gray-400 text-sm mb-0.5">โซน: {product.zone}</p>
              <p className="text-gray-400 text-sm mb-3">ราคา: {product.price.toLocaleString()} บาท</p>

              {/* ปุ่มปรับจำนวน */}
              <div className="flex items-center justify-between my-4 bg-gray-50 p-2 rounded-lg">
                <button
                  onClick={() => updateQuantity(product.id, -1)}
                  disabled={product.quantity === 0}
                  className="w-8 h-8 bg-white border rounded-full shadow-sm disabled:opacity-30 cursor-pointer"
                >
                  -
                </button>
                <span className="text-xl font-bold">{product.quantity}</span>
                <button
                  onClick={() => updateQuantity(product.id, 1)}
                  className="w-8 h-8 bg-white border rounded-full shadow-sm cursor-pointer"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => deleteProduct(product.id)}
                className="w-full text-red-500 text-sm hover:underline cursor-pointer"
              >
                ลบสินค้า
              </button>
            </div>
          ))}

          {filteredProducts.length === 0 && !loading && (
            <p className="col-span-3 text-center text-slate-400 py-10 italic">
              ไม่พบสินค้า
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
