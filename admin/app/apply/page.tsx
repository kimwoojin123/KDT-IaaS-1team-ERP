'use client'


import { useState } from 'react';

export default function Apply() {
  const [category, setCategory] = useState('');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('/addProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cateName: category,
          productName,
          price,
          stock,
        }),
      });

      if (!response.ok) {
        throw new Error('상품을 추가하는데 실패했습니다.');
      }

      const data = await response.json();
      console.log(data.message); // 추가된 상품에 대한 메시지 확인
    } catch (error) {
      console.error('Error adding product:', error);
    }

    // 입력 후 입력 필드 초기화
    setCategory('');
    setProductName('');
    setPrice('');
    setStock('');
  };

  return (
    <div>
      <h1>상품 등록</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            카테고리:
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            상품명:
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            가격:
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            재고:
            <input
              type="text"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">등록</button>
      </form>
    </div>
  );
}