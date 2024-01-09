// export default function OrderInfo(){
//   const []
//   return(
//     <div>주문정보</div>
//   )
// }


import React, { useState, useEffect } from 'react';

import dynamic from 'next/dynamic';

const ClientSideComponent = dynamic(() => import('./YourComponent'), { ssr: false });

const OrderInfoPage: React.FC = () => {

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
        const response = await fetch('/orders'); // 이 엔드포인트는 실제로 존재하는 서버 엔드포인트여야 합니다.
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


// // 주문 목록 페이지 컴포넌트
// export default function OrderListPage() {
//   const [orderList, setOrderList] = useState<Order[]>([]);

//   useEffect(() => {
//     // 사용자명을 어떻게 가져오는지에 대한 로직이 필요합니다.
//     const username = getUsernameSomehow();

//     // 사용자명이 없으면 에러를 출력하고 함수를 종료합니다.
//     if (!username) {
//       console.error('사용자명을 찾을 수 없습니다.');
//       return;
//     }

//     // 서버로부터 사용자의 주문 목록 데이터를 가져옵니다.
//     fetch(`/userOrders?username=${username}`)
//       .then((response) => {
//         // HTTP 응답이 성공적이지 않으면 에러를 발생시킵니다.
//         if (!response.ok) {
//           throw new Error('주문 목록을 가져오는데 실패했습니다.');
//         }
//         // JSON 형태로 변환된 응답을 반환합니다.
//         return response.json();
//       })
//       .then((data) => {
//         // 받아온 데이터를 주문 목록 상태에 설정합니다.
//         setOrderList(data);
//       })
//       .catch((error) => {
//         // 에러가 발생하면 콘솔에 에러 메시지를 출력합니다.
//         console.error('Error fetching user orders:', error);
//       });
//   }, []); // 두 번째 매개변수가 빈 배열이므로 컴포넌트가 마운트될 때 한 번만 실행됩니다.

  
//   return (
//     <div>
//       <h1>Your Orders</h1>
//       <table>
//         <thead>
//           <tr>
//             <th>Date</th>
//             <th>Product Name</th>
//             <th>Product Description</th>
//           </tr>
//         </thead>
//         <tbody>
//           {orderList.map(order => (
//             <tr key={order.id}>
//               <td>{order.date}</td>
//               <td>{order.product_name}</td>
//               <td>{order.product_description}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// // getUsernameSomehow 함수는 사용자명을 가져오는 로직을 구현해야 합니다.
// // 예를 들면, 로그인 상태를 확인하고 로그인된 사용자의 이름을 반환하는 방식일 수 있습니다.
// function getUsernameSomehow() {
//   // 구현 필요
//   return 'exampleUser';
// }
