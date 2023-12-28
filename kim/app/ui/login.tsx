'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Login() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storageToken = localStorage.getItem('token');
    setIsLoggedIn(!!storageToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <div>
      {isLoggedIn ? (
        <div
          className='flex justify-center items-center bg-zinc-400 w-16 h-9'
          onClick={handleLogout}
        >
          <span className='text-sm'>로그아웃</span>
        </div>
      ) : (
        <div className='flex justify-center items-center bg-zinc-400 w-16 h-9'>
          <Link className='text-sm' href='/login'>
            로그인
          </Link>
        </div>
      )}
    </div>
  );
}