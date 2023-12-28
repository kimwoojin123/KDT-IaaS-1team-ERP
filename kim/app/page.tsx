'use client'

import { useEffect, useState } from 'react';
import Category from './ui/category';

export default function Page() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/products') 
      .then((response) => {
        if (!response.ok) {
          throw new Error('상품 데이터를 가져오는 데 문제가 발생했습니다.');
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data); 
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

  return (
    <div className="flex items-center justify-center h-lvh">
      <Category />
      <ul>
        {products.map((product, index) => (
          <li key={index}>{product.productName}</li>
        ))}
      </ul>
    </div>
  );
}