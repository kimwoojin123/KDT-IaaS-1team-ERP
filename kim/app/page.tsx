'use client'

import { useState } from 'react';
import Category from './ui/category';
import Product from './ui/product';

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  return (
    <div>
      <div className="w-lvw h-1/4">
        <Category setSelectedCategory={setSelectedCategory} />
      </div>
      <div className="flex items-center justify-center h-1/4">
        <Product selectedCategory={selectedCategory} />
      </div>
    </div>
  );
}