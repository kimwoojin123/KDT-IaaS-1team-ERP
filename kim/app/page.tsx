'use client'

import Category from './ui/category';
import Product from './ui/product';

export default function Page() {

  return (
    <div className="flex items-center justify-center h-lvh">
      <Category />
      <Product />
    </div>
  );
}