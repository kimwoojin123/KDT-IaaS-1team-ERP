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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">상품 등록</h1>
      <div className="flex justify-center mt-8">
        <form
          className="flex flex-col max-w-md mx-auto my-8 md:my-3 w-full md:w-3/4"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label className="text-2xl font-bold" style={{ lineHeight: "2" }}>
              이미지 업로드 :
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-2 w-full max-w-md"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="text-2xl font-bold" style={{ lineHeight: "2" }}>
              카테고리 :
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border-b border-black outline-none pl-2 w-full border border-gray-300"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="text-2xl font-bold" style={{ lineHeight: "2" }}>
              상품명 :
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="border-b border-black outline-none pl-2 w-full border border-gray-300"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="text-2xl font-bold" style={{ lineHeight: "2" }}>
              가격 :
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="border-b border-black outline-none pl-2 w-full border border-gray-300"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="text-2xl font-bold" style={{ lineHeight: "2" }}>
              재고 :
              <input
                type="text"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="border-b border-black outline-none pl-2 w-full border border-gray-300"
              />
            </label>
          </div>
          <button
            className="bg-blue-500 text-white px-5 py-3 rounded-md text-xl"
            type="submit"
          >
            등록
          </button>
        </form>
      </div>
    </div>
  );
}