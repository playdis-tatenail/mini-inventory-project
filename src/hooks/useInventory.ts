import { useState, useEffect, useMemo } from 'react';
import type { Product } from '../types';

const API_URL = 'https://glowing-space-fishstick-69wjqj99gw6xcwpx-3000.app.github.dev';

export const useInventory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ดึงข้อมูลทั้งหมดจาก API
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/inventory`);
      if (!res.ok) throw new Error('ดึงข้อมูลไม่สำเร็จ');
      const data: Product[] = await res.json();
      setProducts(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // เพิ่มสินค้าใหม่ (POST)
  const addProduct = async (name: string, sku: string, zone: string, quantity: number, price: number) => {
    try {
      const res = await fetch(`${API_URL}/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // ส่งข้อมูลครบ 5 ฟิลด์ไปยัง Backend
        body: JSON.stringify({ name, sku, zone, quantity, price }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.message ?? 'เพิ่มสินค้าไม่สำเร็จ');
      }
      await fetchProducts();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  // ปรับจำนวนสต็อก (PATCH /inventory/:id/adjust)
  const updateQuantity = async (id: string, change: number) => {
    try {
      const res = await fetch(`${API_URL}/inventory/${id}/adjust`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ change }),
      });
      if (!res.ok) throw new Error('ปรับสต็อกไม่สำเร็จ');
      await fetchProducts();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  // ลบสินค้า (DELETE)
  const deleteProduct = async (id: string) => {
    if (!window.confirm('ต้องการลบสินค้านี้ใช่หรือไม่?')) return;
    try {
      const res = await fetch(`${API_URL}/inventory/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.message ?? 'ลบสินค้าไม่สำเร็จ');
      }
      await fetchProducts();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  // ระบบค้นหา (ค้นได้ทั้งชื่อ, SKU, โซน)
  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term) ||
        p.zone.toLowerCase().includes(term)
    );
  }, [products, searchTerm]);

  return {
    products,
    filteredProducts,
    searchTerm,
    setSearchTerm,
    loading,
    error,
    addProduct,
    updateQuantity,
    deleteProduct,
    fetchProducts,
  };
};