'use client'

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PurchasePage() {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');

  const searchParams = useSearchParams();

  useEffect(() => {
    // useSearchParams를 통해 query로 productName과 price를 받아옵니다.
    const params = Object.fromEntries(searchParams);

    // productName과 price를 상태로 설정합니다.
    if (params.productName && params.price) {
      setProductName(params.productName);
      setPrice(params.price);
    }
  }, [searchParams]);

  return (
    <div>
      <h1>Product Details</h1>
      <p>Product Name: {productName}</p>
      <p>Price: {price}</p>
    </div>
  );
}