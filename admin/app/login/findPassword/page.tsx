'use client'

import React, { useState } from 'react';

const FindPasswordPage = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleFindPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('/find-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, username, email }),
      });

      if (!response.ok) {
        throw new Error('서버 오류 발생');
      }

      const data = await response.json();
      setMessage(data.message);

      if (data.message === '해당 사용자를 찾았습니다.') {
        // 찾은 사용자가 있을 때 비밀번호 변경 관련 input 표시
        setNewPassword('');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      const response = await fetch('/update-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, newPassword }),
      });

      if (!response.ok) {
        throw new Error('서버 오류 발생');
      }

      setMessage('비밀번호가 업데이트되었습니다.');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>비밀번호 찾기</h1>
      <form onSubmit={handleFindPassword}>
        <label>
          이름:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <br />
        <label>
          아이디:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <br />
        <label>
          이메일:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">비밀번호 찾기</button>
      </form>
      {message && <h2>{message}</h2>}
      {message === '해당 사용자를 찾았습니다.' && (
        <div>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="새로운 비밀번호 입력"
          />
          <button onClick={handleUpdatePassword}>비밀번호 변경</button>
        </div>
      )}
    </div>
  );
};

export default FindPasswordPage;