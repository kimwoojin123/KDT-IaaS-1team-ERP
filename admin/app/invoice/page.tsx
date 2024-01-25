"use client";

// 'use client' 주석 추가
import React, { useState, useEffect, useCallback } from "react";

// 주문 정보를 나타내는 인터페이스 정의
interface Order {
  username: string;
  productName: string;
  customer: string;
  receiver: string;
  phoneNumber: string;
  address: string;
  price: number;
  quantity: string;
}

// 한 페이지에 표시되는 주문 수
const pageSize = 10;

// 주문 목록 컴포넌트 정의
export default function Invoice() {
  // 주문 목록 상태 변수 초기화
  const [orders, setOrders] = useState<Order[]>([]);
  // 현재 페이지 상태 변수 초기화
  const [currentPage, setCurrentPage] = useState(1);
  // 검색어 상태 변수 초기화
  const [searchTerm, setSearchTerm] = useState("");
  // 전체 페이지 수 상태 변수 초기화
  const [totalPages, setTotalPages] = useState(1);

  // 페이지 정보 상태 변수 초기화
  const [pageInfo, setPageInfo] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
  });

  // 주문 데이터를 가져오는 함수 정의
  const fetchData = useCallback(
    async (page: number, term: string = "") => {
      try {
        // API 엔드포인트 생성
        let apiUrl = `/order?page=${page}&pageSize=${pageSize}`;

        // 검색어가 있는 경우에는 API 엔드포인트에 추가
        if (searchTerm) {
          apiUrl += `&searchTerm=${searchTerm}`;
        }

        // 주문 데이터를 가져와 상태 변수에 설정
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

  // 검색어 초기화
  useEffect(() => {
    setSearchTerm("");
  }, []);

  // 페이지가 변경될 때마다 데이터 가져오기
  useEffect(() => {
    fetchData(pageInfo.currentPage);
  }, [fetchData, pageInfo.currentPage]);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber: number) => {
    setPageInfo({
      ...pageInfo,
      currentPage: pageNumber,
    });
  };

  // JSX 반환
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">주문 목록</h1>
      
      {/* 검색어 입력 필드 */}
      <input
        type="text"
        placeholder="주문자명으로 검색"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border border-gray-300 rounded-md text-black px-10 py-2.5 ml-4 mb-4"
      />

      {/* 주문 목록 테이블 */}
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
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* 페이지 번호 버튼 그룹 */}
      <div className="mt-4 flex items-center justify-center space-x-2">
        {Array.from({ length: pageInfo.totalPages }, (_, index) => index + 1).map(
          (pageNumber) => (
            <button
              key={pageNumber}
              className={`w-10 h-10 px-2 border  rounded ${
                pageNumber === pageInfo.currentPage
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
