'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const LoginButton = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storageToken = localStorage.getItem('token');
    setIsLoggedIn(!!storageToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  return (
    <div>
      {isLoggedIn ? (
        <div
          className='flex justify-center items-center cursor-pointer bg- w-16 h-9'
          onClick={handleLogout}
        >
          <span className='flex justify-center items-center text-sm bg-gray-300 w-16 h-9'>로그아웃</span>
        </div>
      ) : (
        <div className='flex justify-center items-center bg-gray-300 w-16 h-9'>
          <Link className='text-sm' href='/login'>
            로그인
          </Link>
        </div>
      )}
    </div>
  );
};

export default LoginButton;