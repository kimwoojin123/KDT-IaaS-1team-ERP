'use client'

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Purchase(){
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = Object.fromEntries(searchParams);
    if (params.productName && params.price) {
      setProductName(params.productName);
      setProductPrice(params.price);
    }
  }, [searchParams]);
  return (
    <div className='flex flex-col justify-center items-center w-lvw h-lvh'>
      <h1>ORDER</h1>
      <p>배송정보</p>
      <form>
        <li className="flex flex-col w-80">
          <label htmlFor="customer">주문고객</label>
          <input className='border border-black' type='text' id="customer" />
        </li>
        <li className="flex flex-col w-80">
          <label htmlFor="receiver">받는 분</label>
          <input className='border border-black' type='text' id="receiver" />
        </li> 
        <li className="flex flex-col w-80">
          <label htmlFor="phone">휴대폰번호</label>
          <input className='border border-black' type='text' id="phone" />
        </li> 
        <li className="flex flex-col w-80">
          <label htmlFor="address">배송주소</label>
          <input className='border border-black' type='text' id="adress" />
        </li><br />
        <p>상품명 : {productName}</p>
        <p>상품 가격: {productPrice}원</p><br />
        <button className="bg-gray-300 w-20 h-10"type="submit">결제하기</button>
      </form>
    </div>
  )
}