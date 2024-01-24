'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const SignupButton = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storageToken = localStorage.getItem('token');
    setIsLoggedIn(!!storageToken);
  }, []);


  return (
    <div>
      {isLoggedIn ? (
        <div></div>
      ) : (
        <div className='flex justify-center items-center text-[#767676] hover:font-bold text-2lg w-16 h-9'>
          <Link className='flex justify-center items-center text-[#767676] hover:font-bold text-2lg w-16 h-9' href='/signup'>
            회원가입
          </Link>
        </div>
      )}
    </div>
  );
};

export default SignupButton;