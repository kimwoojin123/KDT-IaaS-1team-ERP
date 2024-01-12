'use client'

import Link from 'next/link'
import React from 'react';
import { useRouter } from 'next/navigation';

export default function QnaButton() {
  const router = useRouter();

  const handleMyPageClick = () => {
    const token = localStorage.getItem('token');

    if (token) {
      router.push('/board');
    } else {
      alert('로그인이 필요합니다.');
    }
  };
  return (
    <div className='flex justify-center items-center bg-gray-300 w-20 h-9'>
      <button onClick={handleMyPageClick}>고객문의</button>
    </div>
  );
}