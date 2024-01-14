'use client'

import { useState, useEffect } from 'react'


interface Order {
  username: string;
  productName: string;
  customer: string;
  receiver: string;
  phoneNumber: string;
  address: string;
  price: number;
}

export default function Invoice() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // 서버와 동일한 페이지당 아이템 수를 설정합니다.
   const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetch(`/order?page=${currentPage}&pageSize=${pageSize}`)
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
  }, [currentPage]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="relative mx-4 md:mx-8">
    <h1 className="text-4xl font-bold mb-4">주문 목록</h1>
    <table className="mt-4 border-collapse border w-full">
        <thead className="w-full md:w-full mx-auto mt-4 md:mt-8 border-solid border-2">
          <tr className='text-lg md:text-xl bg-gray-200'>
            <th className='border-r p-2 text-2xl font-bold text-center'>상품명</th>
            <th className='border-r p-2 text-2xl font-bold text-center'>주문자명</th>
            <th className='border-r p-2 text-2xl font-bold text-center'>받는사람</th>
            <th className='border-r p-2 text-2xl font-bold text-center'>휴대폰번호</th>
            <th className='border-r p-2 text-2xl font-bold text-center'>주소</th>
            <th className='border-r p-2 text-2xl font-bold text-center'>가격</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index} className='border-l border-r border-b border-grey-200'>
              <td className='border-r p-2 text-base text-center'>{order.username}</td>
              <td className='border-r p-2 text-base text-center'>{order.customer}</td>
              <td className='border-r p-2 text-base text-center'>{order.receiver}</td>
              <td className='border-r p-2 text-base text-center'>{order.phoneNumber}</td>
              <td className='border-r p-2 text-base text-center'>{order.address}</td>
              <td className='border-r p-2 text-base text-center'>{order.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-center items-center">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
          <button
            key={pageNumber}
            className={`w-10 h-10 px-2 border rounded ${
              pageNumber === currentPage
                ? "bg-blue-500 text-white"
                : "border-gray-300 hover:bg-gray-100"
            }`}
            onClick={() => handlePageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
      </div>
    </div>
  );
          }  