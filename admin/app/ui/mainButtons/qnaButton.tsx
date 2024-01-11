'use client'

import React from 'react';
import { useRouter } from 'next/navigation';

export default function InquiryButton() {
  const router = useRouter();

  const handleManageClick = () => {
    const token = localStorage.getItem('token');

    if (token) {
      router.push('/qna');
    } else {
      alert('로그인이 필요합니다.');
    }
  };

  return (
      <button className="flex justify-center items-center bg-gray-300 w-48 h-32" onClick={handleManageClick}>고객지원</button>
  );
};