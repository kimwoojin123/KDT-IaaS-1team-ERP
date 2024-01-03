'use client'

import { useEffect, useState } from 'react';
import { decode } from 'js-base64'

export default function UserInfo(){
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = token.split('.')[1];
      const decodedPayload = decode(payload);
      const payloadObject = JSON.parse(decodedPayload);
      setUsername(payloadObject.username);
      }
    }, []);
  return (
    <div className='border-solid border-2'>
      <p>{username}님 안녕하세요!</p>
    </div>
  )
}