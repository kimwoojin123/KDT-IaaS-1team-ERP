'use client'

import React, { useEffect, useState } from 'react';
import { decode } from 'js-base64'

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

interface Order {
  orderKey: number;
  username: string;
  productName:string;
  customer: string;
  receiver: string;
  phoneNumber: string;
  address: string;
  price: number;
}

export function OrderEdit() {
  // State를 사용하여 주문 상세 정보를 저장
  const [orderDetail, setOrderDetail] =  useState<Order[]>([]);


  // useEffect를 사용하여 페이지 로딩 시 주문 상세 정보를 가져오도록 설정
  useEffect(() => {
    const username = getUsernameSomehow();
      // orderKey를 기반으로 주문 상세 정보를 가져오는 비동기 함수 호출
      fetch(`orderds?username=${username}`)
        .then((response) => response.json())
        .then((data) => {
          setOrderDetail(data);
        })
        .catch((error) => {
          console.error('Error fetching order detail:', error);
        });
    }, []);

  if (!orderDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Order Details</h1>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>ProductName</th>
            <th>Customer</th>
            <th>Receiver</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {orderDetail.map((order) => (
            <tr key={order.orderKey}>
              <td>{order.username}</td>
              <td>{order.productName}</td>
              <td>{order.customer}</td>
              <td>{order.receiver}</td>
              <td>{order.phoneNumber}</td>
              <td>{order.address}</td>
              <td>{order.price}</td>
              <td>
                <a href="`/edit">주문상세보기</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderEdit();
