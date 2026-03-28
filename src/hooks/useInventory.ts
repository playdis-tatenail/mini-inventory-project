import { useState, useMemo } from 'react';
import type { Product } from '../types';

export const useInventory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // ฟังก์ชันเพิ่มสินค้า
  const addProduct = (name: string, price: number, quantity: number) => {
    const newProduct: Product = { id: Date.now(), name, price, quantity };
    setProducts([...products, newProduct]);
  };

  // ฟังก์ชันอัปเดตจำนวน
  const updateQuantity = (id: number, amount: number) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, quantity: Math.max(0, p.quantity + amount) } : p
    ));
  };

  // ฟังก์ชันลบสินค้า
  const deleteProduct = (id: number) => {
    if (window.confirm("ต้องการลบสินค้านี้ใช่หรือไม่?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  // ระบบค้นหา (Search Logic)
  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  return {
    products,
    filteredProducts,
    searchTerm,
    setSearchTerm,
    addProduct,
    updateQuantity,
    deleteProduct
  };
};