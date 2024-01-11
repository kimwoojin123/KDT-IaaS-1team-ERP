'use client'

import React from 'react';
import { useRouter } from 'next/navigation';

export default function ListButton() {
  const router = useRouter();

  const handleListClick = () => {
    const token = localStorage.getItem('token');

    if (token) {
      router.push('/list');
    } else {
      alert('로그인이 필요합니다.');
    }
  };

  return (
    <button className="flex justify-center items-center bg-gray-300 w-48 h-32" onClick={handleListClick}>상품목록</button>
  );
};



