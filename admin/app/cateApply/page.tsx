'use client'

import { useState } from 'react';


export default function CateApply(){
  const [category, setCategory] = useState('');

  const handleSubmit = async (event: any) => {
    event.preventDefault();
   
    try {
      const response = await fetch('addCategory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category }),
      });

      if (response.ok) {
        alert('카테고리 추가 성공');
      } else {
        alert('이미 존재하는 카테고리 명입니다');
      }
    } catch (error) {
      console.error('API 호출 중 오류 발생', error);
    }
    setCategory('');
  };



  return(
    <div>
      <h1 className="text-3xl font-bold mb-6">카테고리 추가</h1>
        <form
          className="flex flex-col max-w-md mx-auto my-8 md:my-3 w-full md:w-3/4"
          onSubmit={handleSubmit}
        >
      <div className="mb-4">
        <label className="text-2xl font-bold" style={{ lineHeight: "2" }}>
          카테고리명 :
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border-b outline-none pl-2 w-full border border-gray-300"
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
  )
}