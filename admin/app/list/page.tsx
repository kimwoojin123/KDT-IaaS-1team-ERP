"use client";

import React from "react";
import { useState, useEffect } from "react";

interface Product {
  cateName: string;
  productName: string;
  price: string;
  stock: string;
  productKey: number;
}

const pageSize = 10;

export default function List() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  // const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `/products?page=${currentPage}&pageSize=${pageSize}`
      );
      if (!response.ok) {
        throw new Error("상품 정보를 가져오는데 실패했습니다.");
      }
      const data = await response.json();
      setProducts(data.products);

      // 추가: 전체 페이지 수 계산 및 설정
      const totalPages = Math.ceil(data.totalCount / pageSize);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handlePageChange = async (newPage: number) => {
    if (currentPage !== newPage) {
      setCurrentPage(newPage);
      await fetchData(); // fetchData 함수 호출을 await로 감싸 비동기 처리
    }
    // fetchData 함수 호출 이후에 setProducts로 데이터 설정
  };

  const handleCheckboxChange = (index: number) => {
    const selectedIndex = selectedProducts.indexOf(index);
    if (selectedIndex === -1) {
      setSelectedProducts([...selectedProducts, index]);
    } else {
      const updatedSelected = selectedProducts.filter((item) => item !== index);
      setSelectedProducts(updatedSelected);
    }
  };

  const handleDelete = async () => {
    try {
      const deleteRequests = selectedProducts.map((index) => {
        const productId = products[index].productKey;
        return fetch(`/deleteProduct/${productId}`, {
          method: "DELETE",
        }).then((response) => {
          if (!response.ok) {
            throw new Error("상품 삭제에 실패했습니다.");
          }
          return response.json();
        });
      });

      const deleteResults = await Promise.all(deleteRequests);

      // 삭제 요청 결과 확인
      const isDeleteSuccess = deleteResults.every(
        (result) => result.message === "상품이 성공적으로 삭제되었습니다."
      );

      if (isDeleteSuccess) {
        // 삭제 성공 시 화면 갱신
        const updatedProducts = products.filter(
          (_, index) => !selectedProducts.includes(index)
        );
        setProducts(updatedProducts);
        setSelectedProducts([]);

        // 페이지를 다시 불러오거나 서버에서 새로운 데이터를 가져오는 로직 추가
        fetchData();
      } else {
        throw new Error("일부 상품이 삭제되지 않았습니다.");
      }
    } catch (error) {
      console.error("Error deleting products:", error);
    }
  };

  // const handleSearch = () => {
  //   setCurrentPage(1); // 검색 시 첫 페이지로 초기화
  //   fetchData();
  // };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">상품 목록</h1>
      {/* <div className="mb-4">
        <label className="text-2xl font-bold" style={{ lineHeight: "2" }}>
          상품 검색:
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-b border-black outline-none pl-2 w-full"
          />
        </label>
        <button
          className="bg-blue-500 text-white px-5 py-2 rounded-md ml-2"
          onClick={handleSearch}
        >
          검색
        </button>
      </div> */}
      <div className="text-center px-50 py-1">
        <button
          className="bg-blue-500 text-white px-10 py-2.5 rounded-md ml-4 mb-4"
          onClick={handleDelete}
        >
          상품 삭제
        </button>
      </div>
      <table className="mt-4 border-collapse border w-full">
        <thead className="border-b-2 border-solid border-gray-200">
          <tr className="text-lg md:text-xl bg-gray-200">
            <th className="p-2 text-2xl text-center w-1/12 border-solid">
              선택
            </th>
            <th className="p-2 text-2xl text-center w-2/12">카테고리</th>
            <th className="p-2 text-2xl text-center w-3/12">상품명</th>
            <th className="p-2 text-2xl text-center w-2/12">가격</th>
            <th className="p-2 text-2xl text-center w-2/12">재고</th>
          </tr>
        </thead>
        <tbody className="py-4">
          {Array.isArray(products) &&
            products.map((product, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-100" : "bg-white"
                } text-base md:text-lg  px-4 py-4 rounded-md`}
                style={{ lineHeight: "2.5" }}
              >
                <td className="text-center">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.productKey)}
                    onChange={() => handleCheckboxChange(product.productKey)}
                  />
                </td>
                <td className="text-center">{product.cateName}</td>
                <td className="text-center">{product.productName}</td>
                <td className="text-center">{product.price}원</td>
                <td className="text-center">{product.stock}</td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className="mt-4 flex items-center justify-center space-x-2 fixed bottom-0 left-0 w-full bg-white p-4">
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
