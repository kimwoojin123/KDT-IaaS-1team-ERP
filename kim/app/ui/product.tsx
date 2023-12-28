'use client'

import { useState, useEffect} from 'react'

export default function Product(){
  const [products, setProducts] = useState([])
  
  useEffect(() => {
    fetch('/products') 
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
        console.error('Error fetching product:', error);
      });
  }, []);
  return(
    <ul>
        {products.map((products, index) => (
          <li key={index}>{products.productName}</li>
        ))}
    </ul>
  )
}