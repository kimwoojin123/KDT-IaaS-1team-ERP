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
          price : price,
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
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">상품상세</h1>
  
      <div className="container mx-auto p-4 flex">
        <div className="w-1/2 mr-8">
          {/* 첫 번째 이미지 부분 */}
          <div className="w-full h-96 overflow-hidden mb-5">
            <img
              src={`/${productName}.png`}
              width={500}
              height={600}
              alt={productName}
              className="object-cover"
            />
          </div>
          {/* 첫 번째 이미지 부분 끝 */}
        </div>
  


<div className="w-1/2 p-4">
  <div className='mb-8'>
    <p className='text-4xl font-bold mb-2'>{productName}</p>
    <p className='text-2xl font-bold mb-2'>신선한 계란이요~~~~ </p>
    <p className='text-2xl font-bold mb-5'>가격 : {price}</p>
    <p className='text-2xl font-bold mb-5'>배송비 : 무료 </p>

  </div>

  <div className='flex justify-between items-center'>
    <div className='flex items-center'>
      <button onClick={handleDecrement} className="text-xl font-bold px-3 py-2 bg-gray-300 rounded">-</button>
      <span className="text-2xl font-bold mx-4">{quantity}</span>
      <button onClick={handleIncrement} className="text-xl font-bold px-3 py-2 bg-gray-300 rounded">+</button>
    </div>
  </div>





  <div className="flex mt-4">
    <div className='flex  mt-4 space-x-8'>
      <CartAppendButton onClick={handleAddToCart} />
      <PurchaseButton productName={productName} price={price.toString()} quantity={quantity.toString()} productKey={productKey} />
    </div>
  </div> 
  
</div>


      </div>
  
      {/* 추가된 이미지 부분 */}
      <div className="w-full h-96 overflow-hidden mb-5">
        <img
          src="https://via.placeholder.com/800x400" // 이미지 주소를 실제 이미지 주소로 바꿔주세요.
          alt="Product Image"
          className="w-full h-full object-cover"
        />
      </div>
      {/* 추가된 이미지 부분 끝 */}
    </div>
  );
  }  