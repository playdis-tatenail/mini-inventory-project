import { useState } from 'react';
import { useInventory } from '../hooks/useInventory';

// 1. กำหนด "ใบสั่งของ" (Interface) ให้ TypeScript รู้จัก
interface Props {
  inventory: ReturnType<typeof useInventory>; 
}

// 2. รับค่า inventory มาจาก App.tsx ตามใบสั่ง
const ProductManagement = ({ inventory }: Props) => {
  
  // 3. ดึงฟังก์ชันออกมาใช้งาน (ห้ามประกาศ useInventory() ใหม่ในนี้นะครับ!)
  const { 
    filteredProducts, 
    searchTerm, 
    setSearchTerm, 
    addProduct, 
    updateQuantity, 
    deleteProduct 
  } = inventory;

  // State สำหรับฟอร์ม 
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || price <= 0) return alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    addProduct(name, price, quantity);
    setName(''); setPrice(0); setQuantity(0);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Product Manage ment</h2>

      {/* ช่องค้นหา */}
      <input 
        type="text" 
        placeholder="🔍 ค้นหาสินค้า..." 
        className="w-full p-2 mb-6 border rounded-lg shadow-sm"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* ฟอร์มเพิ่มสินค้า */}
      <form
        className="bg-white p-6 rounded-xl shadow-md flex flex-wrap gap-4 mb-10"
        onSubmit={handleSubmit}
      >
        {/* ชื่อสินค้า */}
        <div className="flex flex-col flex-1">
          <label className="text-sm text-slate-600 mb-1">ชื่อสินค้า</label>
          <input
            type="text"
            placeholder="เช่น Coca-Cola"
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* ราคา */}
        <div className="flex flex-col">
          <label className="text-sm text-slate-600 mb-1">ราคา (บาท)</label>
          <input
            type="number"
            placeholder="0"
            min="0"
            className="border p-2 rounded w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={price === 0 ? "" : price} 
            onChange={(e) => {
              const val = e.target.value;
              if (val === "") {
                setPrice(0); // ถ้าลบจนว่าง ให้เซตเป็น 0
              } else {
                const num = Number(val);
                setPrice(num < 0 ? 0 : num);
              }
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
            className="border p-2 rounded w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={quantity === 0 ? "" : quantity}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "") {
                setQuantity(0);
              } else {
                const num = Number(val);
                setQuantity(num < 0 ? 0 : num);
              }
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

      {/* รายการสินค้า */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <div 
            key={product.id} 
            className={`p-6 rounded-2xl shadow-sm border-2 ${product.quantity === 0 ? 'bg-red-50 border-red-200' : 'bg-white border-transparent'}`}
          >
            <h3 className="text-xl font-bold">{product.name}</h3>
            <p className="text-gray-500">{product.price.toLocaleString()} บาท</p>
            
            <div className="flex items-center justify-between my-4 bg-gray-50 p-2 rounded-lg">
              <button onClick={() => updateQuantity(product.id, -1)} className="w-8 h-8 bg-white border rounded-full shadow-sm">-</button>
              <span className="text-xl font-bold">{product.quantity}</span>
              <button onClick={() => updateQuantity(product.id, 1)} className="w-8 h-8 bg-white border rounded-full shadow-sm">+</button>
            </div>
            
            <button onClick={() => deleteProduct(product.id)} className="w-full text-red-500 text-sm hover:underline cursor-pointer">ลบสินค้า</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductManagement;