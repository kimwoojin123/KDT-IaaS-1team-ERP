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
  const [category, setCategory] = useState('')

  useEffect(() => {
    // useSearchParams를 통해 query로 productName과 price를 받아옵니다.
    const params = Object.fromEntries(searchParams);

    // productName과 price를 상태로 설정합니다.
    if (params.category && params.productName && params.price && params.productKey) {
      setCategory(params.category)
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
  


<div className="p-4 flex flex-col items-center">
  <div className='mb-8'>
    <p className='text-4xl font-bold mb-5'>{productName}</p>
    <p className='text-2xl font-bold mb-2'>가격 : {price}</p>
    <p className='text-2xl font-bold mb-2'>배송비 : 무료 </p>

  </div>

  <div className='flex justify-space items-center'>
    <div className='flex items-center'>
    <svg xmlns="http://www.w3.org/2000/svg" width="47" height="46" viewBox="0 0 47 46" fill="none" onClick={handleDecrement} className='cursor-pointer'>
<rect x="1.18164" y="0.762238" width="44.67" height="44.6684" rx="16.5" stroke="#F0F0F0"/>
<path d="M32.0166 23.0965C32.0166 23.4723 31.8725 23.8356 31.603 24.0987C31.3399 24.368 30.9764 24.5184 30.6005 24.5184H24.9359H22.0973H16.4327C16.0568 24.5184 15.6933 24.368 15.4302 24.0987C15.167 23.8356 15.0166 23.4723 15.0166 23.0965C15.0166 22.7206 15.167 22.3636 15.4302 22.0943C15.6933 21.8312 16.0568 21.6808 16.4327 21.6808H22.0973H24.9359H30.6005C30.9764 21.6808 31.3399 21.8312 31.603 22.0943C31.8725 22.3636 32.0166 22.7206 32.0166 23.0965Z" fill="#B3B3B3"/>
</svg>      <span className="text-2xl font-bold mx-4">{quantity}</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="46" height="47" viewBox="0 0 46 47" fill="none" onClick={handleIncrement} className='cursor-pointer'>
<rect x="0.74707" y="1.34662" width="44.67" height="44.6684" rx="16.5" stroke="#E2E2E2"/>
<path d="M31.582 23.6808C31.582 24.0567 31.4379 24.42 31.1685 24.6831C30.9053 24.9524 30.5419 25.1027 30.1659 25.1027H24.5013V30.7652C24.5013 31.1411 24.3509 31.5044 24.0815 31.7674C23.8183 32.0305 23.4611 32.1808 23.0852 32.1808C22.7092 32.1808 22.3458 32.0305 22.0826 31.7674C21.8131 31.5044 21.6628 31.1411 21.6628 30.7652V25.1027H15.9982C15.6222 25.1027 15.2588 24.9524 14.9956 24.6831C14.7324 24.42 14.582 24.0567 14.582 23.6808C14.582 23.305 14.7324 22.948 14.9956 22.6786C15.2588 22.4156 15.6222 22.2652 15.9982 22.2652H21.6628V16.6027C21.6628 16.2269 21.8131 15.8636 22.0826 15.6005C22.3458 15.3312 22.7092 15.1808 23.0852 15.1808C23.4611 15.1808 23.8183 15.3312 24.0815 15.6005C24.3509 15.8636 24.5013 16.2269 24.5013 16.6027V22.2652H30.1659C30.5419 22.2652 30.9053 22.4156 31.1685 22.6786C31.4379 22.948 31.582 23.305 31.582 23.6808Z" fill="#53B175"/>
</svg>    </div>
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
      <div className="w-full h-full overflow-hidden mb-5">
        <img
          src={`/${category}.png`} // 이미지 주소를 실제 이미지 주소로 바꿔주세요.
          alt="Product Image"
          className="w-full h-full object-cover"
        />
      </div>
      {/* 추가된 이미지 부분 끝 */}
    </div>
  );
  }  