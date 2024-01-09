'use client'

// React와 관련된 필요한 기능을 가져옵니다.
import { useState, useEffect } from 'react';

// 사용자 정보를 정의하는 인터페이스를 생성합니다.
interface User {
  name: string;
  username: string;
  cash: number;
  activate: number;
  // 필요한 다른 사용자 속성을 추가할 수 있습니다.
}

// ManagePage 컴포넌트를 정의합니다.
export default function ManagePage() {
  // 사용자 목록을 상태로 관리합니다.
  const [users, setUsers] = useState<User[]>([]);

  // 컴포넌트가 마운트될 때 사용자 목록을 가져오는 효과를 정의합니다.
  useEffect(() => {
    // 서버에서 사용자 목록을 가져오는 API 요청을 보냅니다.
    fetch('/users')
      .then((response) => {
        // 응답이 성공적인지 확인합니다.
        if (!response.ok) {
          // 응답이 실패하면 오류를 throw합니다.
          throw new Error('사용자 정보를 가져오는데 실패했습니다.');
        }
        // JSON 형태로 변환된 응답 데이터를 반환합니다.
        return response.json();
      })
      .then((data) => {
        // 반환된 데이터로 사용자 목록 상태를 업데이트합니다.
        setUsers(data);
      })
      .catch((error) => {
        // 오류가 발생하면 콘솔에 오류 메시지를 출력합니다.
        console.error('Error fetching users:', error);
      });
  }, []);

  // 특정 사용자의 활성 상태를 비활성화하는 함수를 정의합니다.
  const handleToggleActivation = (username: string, currentActivate: number) => {
    // 서버에 PUT 요청을 보내 해당 사용자를 비활성화합니다.
    const newActivate = currentActivate === 1 ? 0 : 1;

    fetch(`/users/${username}/toggle-activate`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      // 응답이 성공적인지 확인합니다.
      if (!response.ok) {
        // 응답이 실패하면 오류를 throw합니다.
        throw new Error('사용자를 비활성화하는데 실패했습니다.');
      }
      // 사용자 목록을 다시 불러와 업데이트하기 위해 서버에 추가 요청을 보냅니다.
      return fetch('/users');
    })
    .then((response) => response.json())
    .then((data) => {
      // 업데이트된 사용자 목록으로 상태를 업데이트합니다.
      setUsers(data);
    })
    .catch((error) => {
      // 오류가 발생하면 콘솔에 오류 메시지를 출력합니다.
      console.error('Error deactivating user:', error);
    });
  };
  
  // JSX를 반환하여 사용자 목록을 표시합니다.
  return (
    <div className='w-lvw h-lvh flex flex-col justify-center items-center'>
      {/* 제목을 표시합니다. */}
      <h1 className='font-bold text-2xl'>사용자 목록</h1>
      {/* 사용자 목록을 표시하기 위한 테이블을 생성합니다. */}
      <table>
        <thead>
          {/* 테이블의 헤더를 정의합니다. */}
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>cash</th>
            <th>activation</th>
          </tr>
        </thead>
        <tbody>
          {/* 사용자 목록을 매핑하여 각 사용자에 대한 정보를 표시합니다. */}
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>{user.cash}</td>
              <td>
                <button onClick={() => handleToggleActivation(user.username, user.activate)}>
                  {user.activate === 1 ? '비활성화' : '활성화'}
              </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}