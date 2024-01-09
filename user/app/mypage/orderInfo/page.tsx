// export default function OrderInfo(){
//   const [oders, setOrders] = useState<Order[]>([]);
//   useEffect(() => {
  //     // 사용자명을 어떻게 가져오는지에 대한 로직이 필요합니다.
  //     const fetchOrders = async () => {
  
  //     // 사용자명이 없으면 에러를 출력하고 함수를 종료합니다.
  //     if (!username) {
  //       console.error('사용자명을 찾을 수 없습니다.');
  //       return;
  //     }
  
  //     fetch(`/orderInfo?username=${username}`)
  //       .then((response) => {
  //         if (!response.ok) {
  //           throw new Error('주문 목록을 가져오는데 실패했습니다.');
  //         }
  //         return response.json();
  //       })
  //       .then((data) => {
  //         setOrders(data);
  //       })
  //       .catch((error) => {
  //         console.error('Error fetching user orders:', error);
  //       });
  //   }, []); 
//   return(
//     <div>주문정보</div>
//   )
// }


import React, { useState, useEffect } from 'react';


// 주문 목록을 나타내는 인터페이스
interface Order {
  orderKey: number;
  username: string;
  customer: string;
  receiver: string;
  phoneNumber: string;
  address: string;
  price: number;
}

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // 서버로부터 주문 목록 데이터를 가져오는 비동기 함수
    const fetchOrders = async () => {
      try {
        const response = await fetch('/orders'); 
        if (!response.ok) {
          throw new Error('주문 목록을 불러오는데 실패했습니다.');
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    // 주문 목록 데이터를 가져오는 함수 호출
    fetchOrders();
  }, []);

  return (
    <div>
      <h1>Order List</h1>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Username</th>
            <th>Customer</th>
            <th>Receiver</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.orderKey}>
              <td>{order.orderKey}</td>
              <td>{order.username}</td>
              <td>{order.customer}</td>
              <td>{order.receiver}</td>
              <td>{order.phoneNumber}</td>
              <td>{order.address}</td>
              <td>{order.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;


