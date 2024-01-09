'use client'

import { useEffect, useState } from 'react';
import { decode } from 'js-base64'



interface UserData {
  cash?: number;
}

export default function MyStatus(){
  const [username, setUsername] = useState('');
  const [userInfo, setUserInfo] = useState<UserData[]>([]);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = token.split('.')[1];
      const decodedPayload = decode(payload);
      const payloadObject = JSON.parse(decodedPayload);
      setUsername(payloadObject.username);
      }
    }, []);

    useEffect(() => {  
      if (!username) {
        console.error('사용자명을 찾을 수 없습니다.');
        return;
      }
  
      fetch(`/users?username=${username}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('주문정보 데이터를 가져오는데 실패했습니다.');
        }
        return response.json();
      })
      .then((data) => {
        setUserInfo(data);
      })
      .catch((error) => {
        console.error('Error fetching user:', error);
      });
  }, [username]);
  
  
  if (!username) {
    return null; 
  }

  return (
    <div>
      <p>사용자 : {username}</p>
      <p>보유캐시 : {userInfo.length > 0 ? userInfo[0].cash : '로딩 중...'}</p>
    </div>
  )
}