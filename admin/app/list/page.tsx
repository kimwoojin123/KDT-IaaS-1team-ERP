'use client'

import { useState, useEffect } from 'react';

export default function List() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/products')
      .then((response) => {
        if (!response.ok) {
          throw new Error('상품 정보를 가져오는데 실패했습니다.');
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

  return (
    <div className='flex flex-col justify-center items-center w-lvw h-lvh'>
      <h1 className='text-2xl font-bold'>상품목록</h1><br />
      <table className='w-80 border-solid border-2 border-black	'>
        <thead  className='border-b-2 border-solid border-black' >
          <tr>
            <th className='text-right'>상품명</th>
            <th className='text-right'>가격</th>
            <th className='text-right'>재고</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td className='text-right'>{product.productName}</td>
              <td className='text-right'>{product.price}원</td>
              <td className='text-right'>{product.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}