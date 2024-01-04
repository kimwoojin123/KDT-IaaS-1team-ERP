'use client'

import { useEffect, useState } from 'react';
import base64, { decode } from "js-base64";

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

interface CartItem{
  productName:string
  price : number
  adddate: string
}


export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const username = getUsernameSomehow();

    if (!username) {
      console.error('사용자명을 찾을 수 없습니다.');
      return;
    }

    fetch(`/userCart?username=${username}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('장바구니 데이터를 가져오는데 실패했습니다.');
      }
      return response.json();
    })
    .then((data) => {
      setCartItems(data);
    })
    .catch((error) => {
      console.error('Error fetching user cart:', error);
    });
}, []);

  return (
    <div>
      <h1>장바구니</h1>
      <ul>
        {cartItems.map((item, index) => (
          <li key={index}>
            <p>상품명: {item.productName}</p>
            <p>가격: {item.price}</p>
            <p>추가일시: {item.adddate}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}