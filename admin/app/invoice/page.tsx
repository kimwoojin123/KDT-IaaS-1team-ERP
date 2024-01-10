'use client'
import { useState, useEffect } from 'react'

interface Order {
  username : string
  productName : string
  customer : string
  receiver : string
  phoneNumber : string
  address : string
  price : number
}


export default function Invoice(){
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    fetch('/order')
      .then((response) => {
        if (!response.ok) {
          throw new Error('주문 정보를 가져오는데 실패했습니다.');
        }
        return response.json();
      })
      .then((data) => {
        setOrders(data);
      })
      .catch((error) => {
        console.error('Error fetching order:', error);
      });
  }, []);

  return (
    <div className='flex flex-col justify-center items-center w-lvw h-lvh'>
      <h1 className='font-bold text-2xl'>사용자 목록</h1><br />
      <table>
        <thead>
          <tr className='border border-black'>
            <th className='border-r border-black'>ID</th>
            <th className='border-r border-black'>상품명</th>
            <th className='border-r border-black'>주문자명</th>
            <th className='border-r border-black'>받는사람</th>
            <th className='border-r border-black'>휴대폰번호</th>
            <th className='border-r border-black'>주소</th>
            <th className='border-r border-black'>가격</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr className = 'border-l border-r border-b border-black'key={index}>
              <td className='border-r border-black'>{order.username}</td>
              <td className='border-r border-black'>{order.productName}</td>
              <td className='border-r border-black'>{order.customer}</td>
              <td className='border-r border-black'>{order.receiver}</td>
              <td className='border-r border-black'>{order.phoneNumber}</td>
              <td className='border-r border-black'>{order.address}</td>
              <td className='border-r border-black'>{order.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}