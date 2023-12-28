'use client'

import Category from './ui/category';
import Product from './ui/product';

export default function Page() {

  return (
   <div> 
      <div className = "w-lvw">
        <Category />
      </div>
      <div className="flex items-center justify-center h-lvh">
        <Product />
      </div>
    </div>
  );
}