'use client'

import React, { useState } from 'react';

const FindUsernamePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('/find-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      if (!response.ok) {
        throw new Error('서버 오류 발생');
      }

      const data = await response.json();
      setUsername(data.username);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>아이디 찾기</h1>
      <form onSubmit={handleSubmit}>
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
          이메일:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">아이디 찾기</button>
      </form>
      {username && (
        <div>
          <h2>찾은 아이디:</h2>
          <p>{username}</p>
        </div>
      )}
    </div>
  );
};

export default FindUsernamePage;