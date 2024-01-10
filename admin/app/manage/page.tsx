'use client'

// React와 관련된 필요한 기능을 가져옵니다.
import { useState, useEffect } from 'react';

// 사용자 정보를 정의하는 인터페이스를 생성합니다.
interface User {
  name: string;
  username: string;
  cash: number;
  activate: number;
  checked:boolean;
  addDate: string;
}

// ManagePage 컴포넌트를 정의합니다.
export default function ManagePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [giveCash, setGiveCash] = useState<string>('')


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
  

  const toggleCheckbox = (index: number) => {
    const updatedUsers = [...users];
    updatedUsers[index].checked = !updatedUsers[index].checked;
    setUsers(updatedUsers);
  };

  const giveCashToUsers = () => {
    const checkedUsers = users.filter((user) => user.checked); // 체크된 사용자 필터링
    if (checkedUsers.length === 0) {
      alert('캐시를 지급할 사용자를 선택하세요.');
      return;
    }
    const usernamesToGiveCash = checkedUsers.map((user) => user.username);


    fetch('/give-cash', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ usernames: usernamesToGiveCash, giveCash }),
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.updatedUsers); 
        setGiveCash(''); 
        alert('지급이 완료되었습니다')
      })
      .catch((error) => {
        console.error('Error granting cash:', error);
      });
  };



  return (
    <div className='w-lvw h-lvh flex flex-col justify-center items-center'>
      <h1 className='font-bold text-2xl'>사용자 목록</h1>
      <table>
        <thead>
          <tr>
            <th>Select</th>
            <th>Name</th>
            <th>Username</th>
            <th>cash</th>
            <th>addDate</th>
            <th>activation</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>
                <input
                  type='checkbox'
                  checked={user.checked || false}
                  onChange={() => toggleCheckbox(index)}
                />
              </td>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>{user.cash}</td>
              <td>{new Date(user.addDate).toISOString().replace('T', ' ').substr(0, 19)}</td>
              <td>
                <button onClick={() => handleToggleActivation(user.username, user.activate)}>
                  {user.activate === 1 ? '활성화' : '비활성화'}
              </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <input
          type='number'
          value={giveCash}
          onChange={(e) => setGiveCash(e.target.value)}
          placeholder='캐시를 입력하세요'
        />
        <button onClick={giveCashToUsers}>지급</button>
      </div>
    </div>
  );
}