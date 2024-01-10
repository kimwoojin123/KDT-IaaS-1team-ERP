'use client'

import React, {useState} from "react";
import Link from 'next/link'


export default function SignUp(){
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleJoin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, username, password }),
      });
      
      if (response.ok) {
        alert('회원가입이 완료되었습니다')
        window.location.href='/'
      } else {
        setMessage("회원가입에 실패했습니다."); // 실패 메시지 설정
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("회원가입 중 오류가 발생했습니다."); // 오류 메시지 설정
    }
  };


  return (
    <div  className="flex flex-col justify-center items-center h-90vh">
      <h1 className="mb-10">회원가입 페이지</h1>
      <form className = "h-32 flex flex-col items-end justify-around" onSubmit={handleJoin}>
        <input className="border border-black text-black" type="text" value={name} placeholder="이름" onChange={(e) => setName(e.target.value)} />
        <input className="border border-black text-black" type="text" value={username} placeholder="아이디" onChange={(e) => setUsername(e.target.value)} />
        <input className="border border-black text-black" type="text" value={password} placeholder="비밀번호" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">회원가입</button>
      </form>
      {message && <p>{message}</p>}
      <Link className="mt-10" href="/login">로그인페이지로</Link>
    </div>
  )
}