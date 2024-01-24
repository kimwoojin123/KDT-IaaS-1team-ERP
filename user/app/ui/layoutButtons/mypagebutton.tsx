'use client'

import React from 'react';
import { useRouter } from 'next/navigation';

export default function MyPageButton() {
  const router = useRouter();

  const handleMyPageClick = () => {
    const token = localStorage.getItem('token');

    if (token) {
      router.push('/mypage');
    } else {
      alert('로그인이 필요합니다.');
    }
  };

  return (
    <div className='flex justify-center items-center w-20 h-9'>
    <button onClick={handleMyPageClick}
     className="text-[#767676] hover:font-bold text-2lg"
      >마이페이지</button>
    </div>
  );
};
