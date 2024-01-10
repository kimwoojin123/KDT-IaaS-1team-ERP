'use client'

import React, { useEffect, useState } from 'react';
import { decode } from 'js-base64'
import { useSearchParams } from 'next/navigation';

const OrderDetail = () => {
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams);

  const { productName, customer, receiver, phoneNumber, address, price } = params;
  
  const [editedReceiver, setEditedReceiver] = useState(receiver);
  const [editedPhoneNumber, setEditedPhoneNumber] = useState(phoneNumber);
  const [editedAddress, setEditedAddress] = useState(address);

  const handleUpdate = async () => {
    // 서버로 수정된 정보를 전송하는 로직을 추가합니다.
    try {
      const response = await fetch('/updateOrderInfo', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiver: editedReceiver,
          phoneNumber: editedPhoneNumber,
          address: editedAddress,
        }),
      });
  
      if (response.ok) {
        console.log('주문 정보가 성공적으로 업데이트되었습니다.');
        // 성공적으로 업데이트되면 필요한 작업을 수행합니다.
      } else {
        console.error('주문 정보 업데이트 실패');
      }
    } catch (error) {
      console.error('주문 정보 업데이트 중 에러:', error);
    }
  };

  return (
    <div>
      <h1>Order Detail</h1>
      <p>Product Name: {productName}</p>
      <p>Customer: {customer}</p>
      <p>Receiver: <input type="text" value={editedReceiver} onChange={(e) => setEditedReceiver(e.target.value)} /></p>
      <p>Phone Number: <input type="text" value={editedPhoneNumber} onChange={(e) => setEditedPhoneNumber(e.target.value)} /></p>
      <p>Address: <input type="text" value={editedAddress} onChange={(e) => setEditedAddress(e.target.value)} /></p>
      <p>Price: {price}</p>
      <button onClick={handleUpdate}>정보 수정</button>
    </div>
  );
};

export default OrderDetail;
