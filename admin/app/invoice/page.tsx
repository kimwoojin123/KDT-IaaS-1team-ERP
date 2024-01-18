"use client";

import React, { useState, useEffect, useCallback } from "react";

interface Order {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 5154e68 (스타일 수정)
  username: string;
  productName: string;
  customer: string;
  receiver: string;
  phoneNumber: string;
  address: string;
  price: number;
<<<<<<< HEAD
=======
  username : string
  productName : string
  customer : string
  receiver : string
  phoneNumber : string
  address : string
  price : number
  quantity:string
>>>>>>> 056ba83 (admin 주문조회 수량 수정)
=======
>>>>>>> 5154e68 (스타일 수정)
}

const pageSize = 10;

export default function Invoice() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [pageInfo, setPageInfo] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
  });

  const fetchData = useCallback(
    async (page: number) => {
      try {
        let apiUrl = `/order?page=${page}&pageSize=${pageSize}`;

        if (searchTerm) {
          apiUrl += `&searchTerm=${searchTerm}`;
        }

        const response = await fetch(apiUrl);
        const data = await response.json();

        setOrders(data.orders);
        setPageInfo({
          currentPage: data.pageInfo.currentPage,
          pageSize: data.pageInfo.pageSize,
          totalPages: data.pageInfo.totalPages,
        });
      } catch (error) {
        console.error("데이터를 불러오는데 실패했습니다.", error);
      }
    },
    [pageSize, searchTerm]
  );

  useEffect(() => {
    setSearchTerm("");
  }, []);

  useEffect(() => {
    fetchData(pageInfo.currentPage);
  }, [fetchData, pageInfo.currentPage]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">주문 목록</h1>
      <input
        type="text"
        placeholder="주문자명으로 검색"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border border-gray-300 rounded-md text-black px-10 py-2.5 ml-4 mb-4"
      />

      <table className="mt-10 border-collapse border w-full ">
        <thead className="w-full md:w-full mx-auto mt-4 md:mt-8 border-solid border-2">
          <tr className="text-lg md:text-xl bg-gray-200">
            <th className="border-r p-2 text-2xl font-bold text-center">
              상품명
            </th>
            <th className="border-r p-2 text-2xl font-bold text-center">
              주문자명
            </th>
            <th className="border-r p-2 text-2xl font-bold text-center">
              받는사람
            </th>
            <th className="border-r p-2 text-2xl font-bold text-center">
              휴대폰번호
            </th>
            <th className="border-r p-2 text-2xl font-bold text-center">
              주소
            </th>
            <th className="border-r p-2 text-2xl font-bold text-center">
              가격
            </th>
<<<<<<< HEAD
=======
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
            <th className='border-r border-black'>수량</th>
>>>>>>> 056ba83 (admin 주문조회 수량 수정)
=======
>>>>>>> 5154e68 (스타일 수정)
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr
              key={index}
              className={`${
                index % 2 === 0 ? "bg-gray-100" : "bg-white"
              } text-base md:text-lg px-4 py-4 rounded-md`}
              style={{ lineHeight: "2.5" }}
            >
              <td className="text-center">{order.productName}</td>
              <td className="p-2 text-base text-center">{order.username}</td>
              <td className="p-2 text-base text-center">{order.receiver}</td>
              <td className="p-2 text-base text-center">{order.phoneNumber}</td>
              <td className="p-2 text-base text-center">{order.address}</td>
              <td className="p-2 text-base text-center">{order.price}</td>
<<<<<<< HEAD
=======
            <tr className = 'border-l border-r border-b border-black'key={index}>
              <td className='border-r border-black'>{order.username}</td>
              <td className='border-r border-black'>{order.productName}</td>
              <td className='border-r border-black'>{order.customer}</td>
              <td className='border-r border-black'>{order.receiver}</td>
              <td className='border-r border-black'>{order.phoneNumber}</td>
              <td className='border-r border-black'>{order.address}</td>
              <td className='border-r border-black'>{order.price}</td>
              <td className='border-r border-black'>{order.quantity}</td>
>>>>>>> 056ba83 (admin 주문조회 수량 수정)
=======
>>>>>>> 5154e68 (스타일 수정)
            </tr>
          ))}
        </tbody>
      </table>
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 flex items-center justify-center space-x-2">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (pageNumber) => (
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
          )
        )}
      </div>
    </div>
  );
}
