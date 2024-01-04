"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductListPage: React.FC = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // 서버에서 데이터를 가져오는 함수
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    // 함수 실행
    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Product List</h1>
      <div>
        {products.map((product: any) => (
          <div key={product.number}>
            <h2>{product.name}</h2>
            <p>Price: {product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductListPage;