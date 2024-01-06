'use client'
import React, { useEffect, useState } from 'react';
import styles from "/app/ui/home.module.css";

const ProductListPage: React.FC = () => {
  // 상품 목록을 저장할 상태 변수를 선언합니다.
  const [products, setProducts] = useState<any[]>([]);

  // 컴포넌트가 마운트될 때 상품 데이터를 가져옵니다.
  useEffect(() => {
    fetch('/productlist')
      .then(response => response.json())
      .then(data => {
        // 가져온 상품 데이터를 상태 변수에 저장합니다.
        setProducts(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []); // 빈 배열을 전달하여 컴포넌트 마운트 시에만 useEffect가 실행되도록 합니다.

  return (
    <div>
      <table>
        <thead>
          <tr className={styles.homeCont}>
            <th>Number</th>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {/* 상태 변수에서 상품 데이터를 순회하며 테이블 행을 렌더링합니다. */}
          {products.map(product => (
            <tr key={product.number}>
              <td>{product.number}</td>
              <td>{product.name}</td>
              <td>{product.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductListPage;
