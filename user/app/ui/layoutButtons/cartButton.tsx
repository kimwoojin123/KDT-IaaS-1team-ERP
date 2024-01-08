'use client'

import React from 'react';
import { useRouter } from 'next/navigation';

export default function CartButton() {
  const router = useRouter();

  const handleMyPageClick = () => {
    const token = localStorage.getItem('token');

    if (token) {
      router.push('/cart');
    } else {
      alert('로그인이 필요합니다.');
    }
  };

  return (
    <div className='flex justify-center items-center bg-gray-300 w-20 h-9'>
      <button onClick={handleMyPageClick}>장바구니</button>
    </div>
  );
};
