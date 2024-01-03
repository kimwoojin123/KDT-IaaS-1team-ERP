  'use client'

  import { useEffect, useState } from 'react';

  interface Product {
    productName: string;
    productKey : number;
    price : number;
  }

  export default function Category() {
    const [category, setCategory] = useState<string[]>([]);
    const [products, setProducts] = useState<Product[]>([]);


    useEffect(() => {
      fetch('/category')
        .then((response) => {
          if (!response.ok) {
            throw new Error('카테고리 데이터를 가져오는 데 문제가 발생했습니다.');
          }
          return response.json();
        })
        .then((data: { cateName: string }[]) => {
          const extractedCategory = data.map((item) => item.cateName);
          setCategory(extractedCategory);
        })
        .catch((error) => {
          console.error('Error fetching category:', error);
        });
    }, []);

    useEffect(() => {
      fetch('/products') // 초기에 모든 상품을 불러옴
        .then((response) => {
          if (!response.ok) {
            throw new Error('상품 데이터를 가져오는 데 문제가 발생했습니다.');
          }
          return response.json();
        })
        .then((data) => {
          setProducts(data);
        })
        .catch((error) => {
          console.error('Error fetching products:', error);
        });
    }, []);



    const fetchProductsByCategory = (cateName: string) => {
      fetch(`/products?cateName=${cateName}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('해당 카테고리의 제품을 가져오는 데 문제가 발생했습니다.');
          }
          return response.json();
        })
        .then((data) => {
          setProducts(data);
        })
        .catch((error) => {
          console.error('Error fetching products by category:', error);
        });
    };


    return (
      <div>
        <ul className="flex justify-around bg-gray-300">
          {category.map((cateName, index) => (
            <li
              className="flex justify-center w-20 h-10 items-center bg-gray-300 hover:bg-slate-200 cursor-pointer"
              key={index}
              onClick={() => fetchProductsByCategory(cateName)}
            >
              {cateName}
            </li>
          ))}
        </ul>
        <ul className='flex flex-col justify-center items-center h-lvh'>
          {products.map((product, index) => (
            <li key={index}>{product.productName}</li>
          ))}
        </ul>
      </div>
    );
  }