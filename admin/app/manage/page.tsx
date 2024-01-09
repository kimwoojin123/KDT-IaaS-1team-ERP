'use client'

import { useState, useEffect } from 'react';

interface User {
  name: string;
  username: string;
  cash : number;
  activate : number;
  // Add other user properties as needed
}

export default function ManagePage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch('/users')
      .then((response) => {
        if (!response.ok) {
          throw new Error('사용자 정보를 가져오는데 실패했습니다.');
        }
        return response.json();
      })
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const handleDeactivateUser = (username: string) => {
    fetch(`/users/${username}/deactivate`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('사용자를 비활성화하는데 실패했습니다.');
      }
      // 사용자 목록을 다시 불러와 업데이트합니다.
      return fetch('/users');
    })
    .then((response) => response.json())
    .then((data) => {
      setUsers(data);
    })
    .catch((error) => {
      console.error('Error deactivating user:', error);
    });
  };
  
  return (
    <div className='w-lvw h-lvh flex flex-col justify-center items-center'>
      <h1 className='font-bold text-2xl'>사용자 목록</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>cash</th>
            <th>activate</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.name}</td>
              <td>{user.username}</td>              
              <td>{user.cash}</td>           
              <td>{user.activate}</td>
              <td>
                <button onClick={() => handleDeactivateUser(user.username)}>
                  비활성화
                </button>
              </td>   
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}