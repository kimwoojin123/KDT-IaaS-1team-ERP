"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Inquiry() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, message }),
      });

      const data = await response.json();
      setResponseMessage(data.message);
    } catch (error) {
      console.error('문의 제출 중 에러:', error);
      setResponseMessage('문의 제출 중 에러가 발생했습니다.');
    }
  };

  return (
    <div>
      <h1>문의 페이지</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            이름:
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            메시지:
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
          </label>
        </div>
        <button type="submit">문의 제출</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

