'use client'

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import PurchaseButton from '../ui/productDetail/purchaseButton';
import CartAppendButton from '../ui/productDetail/cartAppendButton';
import base64, { decode } from "js-base64"


const getUsernameSomehow = () => {
  const token = localStorage.getItem("token");
  
  if (token) {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = decode(payload);
      const payloadObject = JSON.parse(decodedPayload);
      return payloadObject.username;
    } catch (error) {
      console.error("Error parsing token:", error);
    }
  }

  return null;
};



export default function PurchasePage() {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState<number>(0);
  const searchParams = useSearchParams();
  const [productKey, setProductKey] = useState<number | null>(null); // productKey 상태 추가
  const [quantity, setQuantity] = useState(1);


  useEffect(() => {
    // useSearchParams를 통해 query로 productName과 price를 받아옵니다.
    const params = Object.fromEntries(searchParams);

    // productName과 price를 상태로 설정합니다.
    if (params.productName && params.price && params.productKey) {
      setProductName(params.productName);
      setPrice(parseFloat(params.price));
      setProductKey(Number(params.productKey));    }
  }, [searchParams]);


  const handleIncrement = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };



  const handleAddToCart = async () => {
    const username = getUsernameSomehow();

    if (!username || productKey === null) {
      alert('로그인이 필요합니다.')
      console.error('유저명을 찾을 수 없습니다.');
      return;
    }

    try {
      const response = await fetch('/addToCart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          productKey,
          totalPrice : price * quantity,
          productName,
          quantity,
        }),
      });

      if (response.ok) {
        alert('장바구니에 상품이 추가되었습니다.')
        console.log('장바구니에 상품이 추가되었습니다.');
      } else {
        console.error('장바구니에 상품을 추가하는데 실패했습니다.');
      }
    } catch (error) {
      console.error('장바구니 추가 중 에러 발생:', error);
    }
  };

  return (
    <div className='flex flex-col w-lvw h-lvh justify-center items-center'>
      <h1 className='text-2xl font-bold mb-5'>상품상세</h1><br />
      <p className='mb-2'>상품명 : {productName}</p>
      <p className='mb-5'>가격 : {price}</p>
      <div className='flex w-60 justify-around'>
        <div className='flex items-center'>
          <button onClick={handleDecrement}>-</button>
          <span>{quantity}</span>
          <button onClick={handleIncrement}>+</button>
        </div>
        <CartAppendButton onClick={handleAddToCart} />
        <PurchaseButton productName={productName} price={price.toString()} quantity={quantity.toString()} productKey={productKey} />
      </div>
    </div>
  );
}