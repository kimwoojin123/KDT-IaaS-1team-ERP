// import '../globals.css'

// export default  function registeration() {
//   return (
//     <div className="innerbox">
//       <h2>상품등록</h2>
//     </div>
//   );
// }

'use client'
// import React, { useState } from 'react';
import { useState } from 'react';

export default function Registeration() { // 대문자 사용
  const [productKey, setProductKey] = useState('');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('/addProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productKey,
          productName,
          price,
        }),
      });

      if (!response.ok) {
        throw new Error('상품을 추가하는데 실패했습니다.');
      }

      const data = await response.json();
      console.log(data.message); // 추가된 상품에 대한 메시지 확인
      alert('상품 등록 완료')
    } catch (error) {
      console.error('Error adding product:', error);
    }

    // 입력 후 입력 필드 초기화
    setProductName('');
    setProductKey('');
    setPrice('');
  };

  return (
    <div className='flex flex-col justify-center items-center w-lvw h-lvh'>
      <h1 className='font-bold text-2xl'>상품 등록</h1><br /><br /><br />
      <form className='flex flex-col justify-between h-1/2' onSubmit={handleSubmit}>
        <div>
          <label>
            상품번호 : 
            <input
              className='border-solid border-b border-black outline-0	pl-2'
              type="text"
              value={productKey}
              onChange={(e) => setProductKey(e.target.value)}
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
        <button className='border-solid rounded-sm border-2 border-black' type="submit">등록</button>
      </form>
    </div>
  );
}