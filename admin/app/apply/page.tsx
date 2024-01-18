'use client'


import { useState } from 'react';

export default function Apply() {
  const [category, setCategory] = useState('');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState(null);
  const [origin, setOrigin] = useState('');

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const formData = new FormData();

    if (image) {
      formData.append('image', image);
    }

    formData.append('cateName', category);
    formData.append('productName', productName);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('origin', origin);
    
    try {
      const response = await fetch('/addProduct', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const errorMessage = response.status === 400 ? '해당 상품명이 이미 존재합니다.' : '상품을 등록하는데 실패했습니다.';
        throw new Error(errorMessage);
      }
  
      const data = await response.json();
      console.log(data.message);
      alert('상품 등록 완료');
    } catch (error) {
      console.error('Error adding product:', error);
      alert((error as Error).message);
    }
  
    setCategory('');
    setProductName('');
    setPrice('');
    setStock('');
    setOrigin('');
    setImage(null);
  };


  const handleImageChange = (event : any) => {
    const selectedImage = event.target.files[0];
    setImage(selectedImage);
  };


  return (
    <div className='flex flex-col justify-center items-center w-lvw h-lvh'>
      <h1 className='font-bold text-2xl'>상품 등록</h1><br /><br /><br />
      <form className='flex flex-col justify-between h-1/2' onSubmit={handleSubmit}>
        <div>
          <label>
          이미지 업로드 :
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          </label>
        </div>
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
        <div>
          <label>
            원산지 : 
            <input
            className='border-solid border-b border-black outline-0	pl-2'
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
            />
          </label>
        </div>
        <button className='border-solid rounded-sm border-2 border-black' type="submit">등록</button>
      </form>
    </div>
  );
}