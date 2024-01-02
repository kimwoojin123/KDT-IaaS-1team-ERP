'use client'

import { useState } from 'react';
import Category from './ui/category';

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  return (
    <div>
      <div className="w-lvw h-1/4">
        <Category setSelectedCategory={setSelectedCategory} />
      </div>
    </div>
  );
}