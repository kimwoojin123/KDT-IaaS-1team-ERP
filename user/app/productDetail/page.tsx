'use client'

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import PurchaseButton from '../ui/productDetail/purchaseButton';
import CartButton from '../ui/productDetail/cartButton';

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
      <h1 className='text-2xl font-bold mb-5'>상품상세</h1><br />
      <p className='mb-2'>상품명 : {productName}</p>
      <p className='mb-5'>가격 : {price}</p>
      <div className='flex w-60 justify-around'>
        <CartButton />
        <PurchaseButton productName={productName} price={price} />
      </div>
    </div>
  );
}