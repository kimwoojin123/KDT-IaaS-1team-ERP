"use client";

import { useState, useEffect } from "react";

interface Product {
  cateName: string;
  productName: string;
  price: string;
  stock: string;
  productKey: Number;
}

export default function List() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  useEffect(() => {
    fetch("/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("상품 정보를 가져오는데 실패했습니다.");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

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
      } else {
        throw new Error("일부 상품이 삭제되지 않았습니다.");
      }
    } catch (error) {
      console.error("Error deleting products:", error);
    }
  };

  return (
    <div className="relative mx-4 md:mx-8">
      <h1 className="text-4xl font-bold mb-4">상품목록</h1>
      <button
        className="bg-yellow-500 text-white px-4 py-2 mb-1"
        onClick={handleDelete}
      >
        상품 삭제
      </button>
      <table className="w-full md:w-full mx-auto mt-4 md:mt-8 border-solid border-2 border-gray-200">
        <thead className="border-b-2 border-solid border-gray-200 ">
          <tr className="text-lg md:text-xl bg-gray-200">
            <th className="p-2 text-2xl text-center border-b-2 border-solid">선택</th>
            <th className="p-2 text-2xl text-center w-2/12">카테고리</th>
            <th className="p-2 text-2xl text-center w-3/12">상품명</th>
            <th className="p-2 text-2xl text-center w-2/12">가격</th>
            <th className="p-2 text-2xl text-center w-2/12">재고</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index} className="text-base md:text-lg">
              <td className="text-center">
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(index)}
                  onChange={() => handleCheckboxChange(index)}
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
    </div>
  );
}
