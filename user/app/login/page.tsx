'use client'

import React, {useState} from "react";
import Link from 'next/link'


export default function Login(){

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        const { token } = await response.json(); // 토큰 및 사용자 정보 받기
        localStorage.setItem("token", JSON.stringify(token)); 
  
        alert("로그인이 완료되었습니다.");
        window.location.href = '/';
      } else {
        setMessage("로그인에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("로그인 중 오류가 발생했습니다.");
    }
  };

  

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="mb-10 text-3xl font-bold">로그인 페이지</h1>
      <form className="w-full max-w-md" onSubmit={handleLogin}>
        <div className="mb-4 flex flex-col">
          <input
            className="border border-black p-2 mb-2"
            type="text"
            value={username}
            placeholder="아이디"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="border border-black p-2 mb-4"
            type="password"
            value={password}
            placeholder="비밀번호"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="border border-black p-2 bg-blue-500 text-white rounded"
            type="submit"
          >
            로그인
          </button>
        </div>
      </form>
      <div className="flex w-full max-w-md justify-between">
        <div>
          <Link href="/login/findUsername">아이디 찾기</Link>
          <span style={{ margin: "0 10px" }} />
          <Link href="/login/findPassword">비밀번호 찾기</Link>
        </div>
        <Link className="ml-auto" href="/">
          메인페이지로
        </Link>
      </div>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
