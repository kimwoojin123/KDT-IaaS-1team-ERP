'use client'

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import base64, { decode } from "js-base64"

const getUsernameSomehow = () => {
  const token = localStorage.getItem("token");
  
  if (token) {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = decode(payload);
      const payloadObject = JSON.parse(decodedPayload);
      return payloadObject.username
    } catch (error) {
      console.error("Error parsing token:", error);
    }
  }

  return null;
};



export default function Purchase(){
  const username = getUsernameSomehow();
  const [productsInfo, setProductsInfo] = useState<{ name: string; price: number }[]>([]);
  const [products, setProducts] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const searchParams = useSearchParams();



  useEffect(() => {
    const params = Object.fromEntries(searchParams);
    if (params.productName && params.price) {
      const productList = params.productName.split(',');
      const priceList = params.price.split(',').map((price: string) => parseInt(price, 10));

      const productsWithPrices = productList.map((productName, index) => ({
        name: productName,
        price: priceList[index],
      }));

      const totalPriceSum = priceList.reduce((acc: number, curr: number) => acc + curr, 0);

      setProductsInfo(productsWithPrices);
      setTotalPrice(totalPriceSum);
    }
  }, [searchParams]);



  const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      username: username,
      customer: e.currentTarget.customer.value,
      receiver: e.currentTarget.receiver.value,
      phoneNumber: e.currentTarget.phoneNumber.value,
      address: e.currentTarget.address.value,
      price: totalPrice,
    };


    try {
      const response = await fetch('/createOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        console.log('주문이 성공적으로 생성되었습니다.');
        alert('주문 완료')
        window.location.href='/'
      } else {
        console.error('주문 생성 실패');
      }
    } catch (error) {
      console.error('주문 생성 중 에러:', error);
    }
  };



  return (
    <div className='flex flex-col justify-center items-center w-lvw h-lvh'>
      <h1 className='text-2xl font-bold'>ORDER</h1>
      <p>배송정보</p>
      <form onSubmit={handleSubmit}>
        <li className="flex flex-col w-80">
          <label htmlFor="customer">주문고객</label>
          <input className='border border-black' type='text' name='customer' id="customer" />
        </li>
        <li className="flex flex-col w-80">
          <label htmlFor="receiver">받는 분</label>
          <input className='border border-black' type='text' name='receiver' id="receiver" />
        </li> 
        <li className="flex flex-col w-80">
          <label htmlFor="phone">휴대폰번호</label>
          <input className='border border-black' type='text' name='phoneNumber' id="phone" />
        </li> 
        <li className="flex flex-col w-80">
          <label htmlFor="address">배송주소</label>
          <input className='border border-black' type='text' name='address' id="adress" />
        </li><br />
        <input type='hidden' name='price' value={totalPrice} />
        <input type='hidden' name='username' value={username} />
        <p>선택한 상품 목록:</p>
        <ul>
           {productsInfo.map((product, index) => (
          <li key={index}>
            {product.name}: {product.price}원
          </li>
          ))}
        </ul>
       <p>총 가격: {totalPrice}원</p>
        <button className="bg-gray-300 w-20 h-10"type="submit">결제하기</button>
      </form>
    </div>
  )
}