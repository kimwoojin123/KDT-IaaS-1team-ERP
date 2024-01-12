'use client'

import React from 'react';
import { useRouter } from 'next/navigation';

export default function ApplyButton() {
  const router = useRouter();

  const handleApplyClick = () => {
    const token = localStorage.getItem('token');

    if (token) {
      router.push('/apply');
    } else {
      alert('로그인이 필요합니다.');
    }
  };

  return (
    <button className="flex justify-center items-center bg-gray-300 w-48 h-32" onClick={handleApplyClick}>상품등록</button>
  );
};



