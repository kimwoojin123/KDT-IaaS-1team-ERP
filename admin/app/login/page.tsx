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
  
        const parsedToken = JSON.parse(localStorage.getItem("token") || ''); // 저장된 토큰 가져오기
        if (parsedToken) {
          const usernameFromToken = parsedToken.username; // 토큰에서 username 추출
          console.log(usernameFromToken); // username 출력 (디버깅용)
        }
  
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
    <div  className="flex flex-col justify-center items-center h-lvh">
      <h1 className="mb-10">로그인페이지</h1>
      <form  className = "h-32 flex flex-col items-end justify-around" onSubmit={handleLogin}>
      <input className="border border-black" type="text" value={username} placeholder="아이디" onChange={(e)=>setUsername(e.target.value)}/>
      <input className="border border-black" type="text" value={password} placeholder="비밀번호"  onChange={(e) => setPassword(e.target.value)} />
      <button className="border border-black" type="submit" >로그인</button>
      </form>
      {message && <p>{message}</p>}
      <Link className="mt-10" href="/">메인페이지로</Link>
    </div>
  )
}