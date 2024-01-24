'use client'

import React from 'react';
import { useRouter } from 'next/navigation';

export default function BoardButton() {
  const router = useRouter();

  const handleBoardClick = () => {
    const token = localStorage.getItem('token');

    if (token) {
      router.push('/board');
    } else {
      alert('로그인이 필요합니다.');
    }
  };

  return (
    <div className='flex justify-center items-center bg-gray-300 w-20 h-9'>
      <button onClick={handleBoardClick}>고객센터</button>
    </div>
  );
};
