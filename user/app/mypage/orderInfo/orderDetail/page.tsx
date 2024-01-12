'use client'

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function OrderDetail() {
  const [productName, setProductName] = useState('');
  const [customer, setCustomer] = useState('');
  const [receiver, setReceiver] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState('');
  const [orderKey, setOrderKey] = useState('');

  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams);


  useEffect(() => {
    setProductName(params.productName || '');
    setCustomer(params.customer || '');
    setReceiver(params.receiver || '');
    setPhoneNumber(params.phoneNumber || '');
    setAddress(params.address || '');
    setPrice(params.price || '');
    setOrderKey(params.orderKey || '');
  }, []);

  const updateOrderTable = () => {
    const orderData = {
      orderKey: orderKey,
      receiver: receiver,
      phoneNumber: phoneNumber,
      address: address,
    };

    fetch('/order-edit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('주문 테이블 업데이트에 실패했습니다.');
        }
        console.log('주문 테이블이 업데이트되었습니다.');
        alert('주문정보 수정 완료')
      })
      .catch((error) => {
        console.error('Error updating order table:', error);
      });
  };

  return (
    <div>
      <h1>Order Detail</h1>
      <input type="hidden" name="orderKey" value={orderKey} />
      <p>Product Name: {productName}</p>
      <p>Customer: {customer}</p>
      <p>Receiver: <input type="text" value={receiver} onChange={(e) => setReceiver(e.target.value)} /></p>
      <p>Phone Number: <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} /></p>
      <p>Address: <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} /></p>
      <p>Price: {price}</p>
      <button onClick={updateOrderTable}>수정</button>
    </div>
  );
}