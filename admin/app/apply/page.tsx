'use client'


import { useState } from 'react';

export default function Apply() {
  const [category, setCategory] = useState('');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');


  const handleSubmit = async (event: any) => {
    event.preventDefault();

    try {
        const dataToSend = {
          cateName: category,
          productName: productName,
          price: price,
          stock: stock,
        };

        // 서버로 JSON 데이터 전송
        fetch('/addProduct', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('상품을 추가하는데 실패했습니다.');
            }
            return response.json();
          })
          .then((data) => {
            console.log(data.message); // 추가된 상품에 대한 메시지 확인
            alert('상품 등록 완료');
          })
          .catch((error) => {
            console.error('Error adding product:', error);
          });
    } catch (error) {
      console.error('Error:', error);
    }

    // 입력 후 입력 필드 초기화
    setCategory('');
    setProductName('');
    setPrice('');
    setStock('');
  };




  return (
    <div className='flex flex-col justify-center items-center w-lvw h-lvh'>
      <h1 className='font-bold text-2xl'>상품 등록</h1><br /><br /><br />
      <form className='flex flex-col justify-between h-1/2' onSubmit={handleSubmit}>
        <div>
          <label>
            카테고리 : 
            <input
              className='border-solid border-b border-black outline-0	pl-2'
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            상품명 : 
            <input
            className='border-solid border-b border-black outline-0	pl-2'
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            가격 : 
            <input
            className='border-solid border-b border-black outline-0	pl-2'
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            재고 : 
            <input
            className='border-solid border-b border-black outline-0	pl-2'
              type="text"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </label>
        </div>
        <button className='border-solid rounded-sm border-2 border-black' type="submit">등록</button>
      </form>
    </div>
  );
}