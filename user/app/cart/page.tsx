'use client'

import { useEffect, useState } from 'react';
import base64, { decode } from "js-base64";
import { useRouter } from 'next/navigation'


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
  cartItemId: number;
  cartKey:number;
  productKey:number;
  quantity:number;
}


export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCartItems, setSelectedCartItems] = useState<number[]>([]);
  const router = useRouter();

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




    const handleCheckboxChange = (index: number) => {
      const selectedIndex = selectedCartItems.indexOf(index);
      if (selectedIndex === -1) {
        setSelectedCartItems([...selectedCartItems, index]);
      } else {
        const updatedSelected = selectedCartItems.filter((item) => item !== index);
        setSelectedCartItems(updatedSelected);
      }
    };




    const handleDelete = async () => {
      try {
        const deleteRequests = selectedCartItems.map((index) => {
          const cartItemId = cartItems[index].cartKey;
          console.log('DELETE 요청 URL:', `/deleteCartItem/${cartItemId}`);
          console.log('DELETE 요청 데이터:', { cartItemId }); // 데이터 확인을 위해 출력
          return fetch(`/deleteCartItem/${cartItemId}`, {
            method: 'DELETE',
          })
          .then((response) => {
            if (!response.ok) {
              throw new Error('장바구니 항목 삭제에 실패했습니다.');
            }
            return response.json();
          });
        });

    const deleteResults = await Promise.all(deleteRequests);

    const isDeleteSuccess = deleteResults.every((result) => result.message === '장바구니 항목이 성공적으로 삭제되었습니다.');

    if (isDeleteSuccess) {
      const updatedCartItems = cartItems.filter((_, index) => !selectedCartItems.includes(index));
      setCartItems(updatedCartItems);
      setSelectedCartItems([]);
    } else {
      throw new Error('일부 장바구니 항목이 삭제되지 않았습니다.');
    }
  } catch (error) {
    console.error('Error deleting cart items:', error);
  }
};



const handlePurchase = () => {
  const selectedItems = cartItems.filter((_, index) => selectedCartItems.includes(index));
  const productPrice = selectedItems.map(item => item.price)
  const productNames = selectedItems.map(item => item.productName);
  const productKeys = selectedItems.map(item => item.productKey);
  const quantities = selectedItems.map(item => item.quantity);
  const totalPrice = selectedItems.reduce((acc, curr) => acc + curr.price, 0);

  router.push(`/productDetail/purchase?productName=${productNames.join(',')}&price=${productPrice.join(',')}&quantity=${quantities.join(',')}&totalPrice=${totalPrice}&productKey=${productKeys.join(',')}`,
  );
};



return (
  <div className="w-70vw mx-auto h-full flex flex-col items-center">
    {/* 장바구니 카테고리 */}
    <div className="flex justify-around items-center w-full p-4">
      <h1 className="text-4xl font-bold">장바구니</h1>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded-md"
        onClick={handleDelete}
      >
        선택 상품 삭제
      </button>
    </div>

    {/* 장바구니 아이템 목록 */}
    <ul className="w-full">
      {cartItems.map((item, index) => (
        <li className="flex justify-around mb-4 border p-4" key={index}>
          {/* 체크박스와 이미지 */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectedCartItems.includes(index)}
              onChange={() => handleCheckboxChange(index)}
            />
            {/* 이미지 데이터를 표시하는 부분 */}
            <img
              src={item.imageUrl}
              alt={item.productName}
              className="w-10 h-10 object-cover ml-4"
            />
          </div>

          {/* 상품 정보 */}
          <div className="ml-4 flex items-center">
            <div className="flex flex-col text-right">
              <p className="font-bold w-60%">{item.productName}</p>
              <p className="w-60%">{item.adddate}</p>
              <p className="w-60%">{item.price} 원</p>
              <p className="w-60%">{item.quantity} 개</p>
            </div>
          </div>
        </li>
      ))}
    </ul>

    {/* 총 결제금액 */}
    <div className="w-60% text-right mt-4">
      <p className="font-bold">총 결제금액: XXXX 원</p>
    </div>

    {/* 상품 구매 버튼 */}
    <button
      onClick={handlePurchase}
      className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
    >
      선택 상품 구매
    </button>
  </div>
);
}