'use client'

import { useEffect, useState } from 'react';

export default function TopProductSection() {
  const [mostSoldProduct, setMostSoldProduct] = useState({ productKey: 0, totalQuantity: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/mostSoldProduct');

        if (!response.ok) {
          throw new Error(`최다 판매 상품 데이터를 가져오지 못했습니다. 상태: ${response.status}`);
        }

        const mostSoldProductData = await response.json();
        setMostSoldProduct(mostSoldProductData);
      } catch (error) {
        console.error('최다 판매 상품 데이터를 가져오는 중 오류 발생:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>최다 판매 상품</h2>
      <p>상품 키: {mostSoldProduct.productKey}</p>
      <p>판매량: {mostSoldProduct.totalQuantity}</p>
    </div>
  );
}