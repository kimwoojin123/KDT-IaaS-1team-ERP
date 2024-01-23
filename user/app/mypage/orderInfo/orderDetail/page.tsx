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
  const [quantity, setQuantity] = useState('')

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
    setQuantity(params.quantity || '')
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
    <div className="container mx-auto p-4 w-full max-w-2xl">
      <h1 className="text-2xl font-bold text-center mb-6">Order Detail</h1>
      <input type="hidden" name="orderKey" value={orderKey} />
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Product Name
        </label>
        <p className="p-2 bg-gray-100 rounded">{productName}</p>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Customer
        </label>
        <p className="p-2 bg-gray-100 rounded">{customer}</p>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Receiver
        </label>
        <input
          type="text"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Phone Number
        </label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Address
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Price
        </label>
        <p className="p-2 bg-gray-100 rounded">{price}</p>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Quantity
        </label>
        <p className="p-2 bg-gray-100 rounded">{quantity}</p>
      </div>
      <button
        onClick={updateOrderTable}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
      >
        수정하기
      </button>
    </div>
  );
}