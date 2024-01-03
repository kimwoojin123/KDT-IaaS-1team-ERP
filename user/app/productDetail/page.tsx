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
    <div className='flex flex-col w-lvw h-lvh justify-center items-center'>
      <h1 className='text-2xl font-bold'>상품상세</h1><br />
      <p>상품명 : {productName}</p>
      <p>가격 : {price}</p>
    </div>
  );
}