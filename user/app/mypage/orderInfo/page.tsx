import React, { useState, useEffect } from 'react';


// 주문 목록을 나타내는 인터페이스
interface Order {
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


