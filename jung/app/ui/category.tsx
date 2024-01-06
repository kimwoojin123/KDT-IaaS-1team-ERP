"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductRegistratuin from "../ppp/pags";

interface Product {
  productName: string;
}

export default function Category() {
  const [category, setCategory] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/category")
      .then((response) => {
        if (!response.ok) {
          throw new Error("카테고리 데이터를 가져오는 데 문제가 발생했습니다.");
        }
        return response.json();
      })
      .then((data: { cateName: string }[]) => {
        const extractedCategory = data.map((item) => item.cateName);
        setCategory(extractedCategory);
      })
      .catch((error) => {
        console.error("Error fetching category:", error);
      });
  }, []);

  useEffect(() => {
    fetch("/products") // 초기에 모든 상품을 불러옴
      .then((response) => {
        if (!response.ok) {
          throw new Error("상품 데이터를 가져오는 데 문제가 발생했습니다.");
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

  const fetchProductsByCategory = (cateName: string) => {
    fetch(`/products?cateName=${cateName}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "해당 카테고리의 제품을 가져오는 데 문제가 발생했습니다."
          );
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching products by category:", error);
      });
  };

  return (
    <div className='cate'>
      <ul className='cateOne'>
        {category.map((cateName, index) => (
          <li
            className='cateTwo'
            key={index}
            onClick={() => fetchProductsByCategory(cateName)}
          >
            {cateName}
          </li>
        ))}
      </ul>
<<<<<<<< HEAD:bang/app/list/category.tsx
      <ul className='cateThree'>
========
      <ul className="flex flex-col justify-center items-center h-lvh">
>>>>>>>> origin/work3:jung/app/ui/category.tsx
        {products.map((product, index) => (
          <li key={index}>{product.productName}</li>
        ))}
        <li className="space-y-20"></li>
      </ul>
    </div>
  );
}
