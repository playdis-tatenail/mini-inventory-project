import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useInventory } from './hooks/useInventory'; 
import Dashboard from './pages/Dashboard';
import ProductManagement from './pages/ProductManagement';

function App() {
  // เรียกใช้ Hook 
  const inventory = useInventory(); 

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        {/* Navigation Bar แบบ Tailwind */}
        <nav className="bg-white shadow-md p-4 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📦</span>
              <span className="font-extrabold text-xl text-blue-600 tracking-tight">
                Mini Inventory
              </span>
            </div>
            
            <div className="flex gap-6">
              <Link 
                to="/" 
                className="font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                Dashboard
              </Link>
              <Link 
                to="/products"  /*font ของลิ้งค์ที่จะเข้า โปรดัก*/
                className="font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                จัดการสินค้า
              </Link>
              
            </div>
          </div>
        </nav>

        {/* ส่วนแสดงเนื้อหา (Main Content) */}
        <main className="max-w-6xl mx-auto py-8">
          <Routes>
            {/* ส่ง products ไปให้ Dashboard คำนวณผลสรุป */}
            <Route path="/" element={<Dashboard products={inventory.products} loading={inventory.loading} error={inventory.error} />} />
            
            {/* ส่ง inventory (ทั้งก้อนที่มีฟังก์ชัน) ไปให้หน้าจัดการ */}
            <Route path="/products" element={<ProductManagement inventory={inventory} />} />
            
          </Routes>
        </main>
      </div>
    </Router>
    
  );
}

export default App;