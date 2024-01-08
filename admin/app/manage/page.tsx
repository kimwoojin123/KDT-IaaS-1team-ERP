'use client'

import { useState, useEffect } from 'react';

interface User {
  name: string;
  username: string;
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

  
  return (
    <div className='w-lvw h-lvh flex flex-col justify-center items-center'>
      <h1 className='font-bold text-2xl'>사용자 목록</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.name}</td>
              <td>{user.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}