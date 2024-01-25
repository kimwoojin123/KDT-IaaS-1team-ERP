'use client'

import React, { useState, useEffect } from 'react';
import { decode } from 'js-base64'
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



// 주문 목록을 나타내는 인터페이스
interface Order {
  orderKey: number;
  username: string;
  productName:string;
  customer: string;
  receiver: string;
  phoneNumber: string;
  address: string;
  price: number;
  quantity:string;
  adddate:string;
}



export function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();

  useEffect(() => {
    const username = getUsernameSomehow();

    if (!username) {
      console.error('사용자명을 찾을 수 없습니다.');
      return;
    }

    fetch(`/orders?username=${username}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('주문정보 데이터를 가져오는데 실패했습니다.');
      }
      return response.json();
    })
    .then((data) => {
      setOrders(data);
    })
    .catch((error) => {
      console.error('Error fetching user cart:', error);
    });
}, []);


  const moveOrderDetail = (order: Order) => {
    const { orderKey, productName, customer, receiver, phoneNumber, address, price, quantity } = order;
    const url = `/mypage/orderInfo/orderDetail?orderKey=${orderKey}&productName=${productName}&customer=${customer}&receiver=${receiver}&phoneNumber=${phoneNumber}&address=${address}&price=${price}&quantity=${quantity}`;

    router.push(url);
  };



  return (
    <div className="container mx-auto px-4 py-2">
      <h1 className="text-2xl font-bold text-gray-800 my-4">Order List</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="w-full h-12 text-left text-gray-600">
              <th className="px-6 py-3 border-b-2 border-gray-200">Username</th>
              <th className="px-6 py-3 border-b-2 border-gray-200">
                ProductName
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-200">Customer</th>
              <th className="px-6 py-3 border-b-2 border-gray-200">Receiver</th>
              <th className="px-6 py-3 border-b-2 border-gray-200">
                Phone Number
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-200">Address</th>
              <th className="px-6 py-3 border-b-2 border-gray-200">Price</th>
              <th className="px-6 py-3 border-b-2 border-gray-200">Quantity</th>
              <th className="px-6 py-3 border-b-2 border-gray-200">AddDate</th>
              <th className="px-6 py-3 border-b-2 border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {orders.map((order) => (
              <tr key={order.orderKey} className="hover:bg-gray-100">
                <td className="px-6 py-4 border-b border-gray-200">
                  {order.username}
                </td>
                <td className="px-6 py-4 border-b border-gray-200">
                  {order.productName}
                </td>
                <td className="px-6 py-4 border-b border-gray-200">
                  {order.customer}
                </td>
                <td className="px-6 py-4 border-b border-gray-200">
                  {order.receiver}
                </td>
                <td className="px-6 py-4 border-b border-gray-200">
                  {order.phoneNumber}
                </td>
                <td className="px-6 py-4 border-b border-gray-200">
                  {order.address}
                </td>
                <td className="px-6 py-4 border-b border-gray-200">
                  {order.price}
                </td>
                <td className="px-6 py-4 border-b border-gray-200">
                  {order.quantity}
                </td>
                <td className="px-6 py-4 border-b border-gray-200">
                  {order.adddate}
                </td>
                <td className="px-6 py-4 border-b border-gray-200">
                  <button
                    onClick={() => moveOrderDetail(order)}
                    className="text-white bg-blue-500 hover:bg-blue-700 font-medium py-1 px-3 rounded"
                  >
                    상세정보
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


export default OrderList;