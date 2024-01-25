import { useState, useEffect } from 'react';

interface Product {
  productName: string;
}

interface ProductProps {
  selectedCategory: string;
}

export default function Product({ selectedCategory }: ProductProps) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = '/products';

        if (selectedCategory) {
          url += `?cateName=${selectedCategory}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('상품 데이터를 가져오는 데 문제가 발생했습니다.');
        }

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setProducts([]); // 데이터를 불러오는 데 문제가 발생한 경우 빈 배열로 설정
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  return (
    <ul>
      {products.map((product, index) => (
        <li key={index}>{product.productName}</li>
      ))}
    </ul>
  );
}