'use client'

import React, {useState} from "react";
import Link from 'next/link'


export default function Login(){
  const [username, setUsername] = useState(""); // const [callback할 것, ]      = useState( type 설정)
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
    <div  className="flex flex-col justify-center items-center h-90vh">
      <h1 className="mb-10">로그인페이지</h1>
      <form  className = "h-32 flex flex-col items-end justify-around" onSubmit={handleLogin}>
      <input className="border border-black  text-black" type="text" value={username} placeholder="type id" onChange={(e)=>setUsername(e.target.value)}/>
      <input className="border border-black  text-black" type="text" value={password} placeholder="type pw"  onChange={(e) => setPassword(e.target.value)} />
      <button className="border border-black  text-white" type="submit">로그인</button>
      </form>
      <Link href="/login/findUsername">ID찾기</Link>
      <Link href="/login/findPassword">PW찾기</Link>
      {message && <p>{message}</p>}
      <Link className="mt-10" href="/">메인페이지로</Link>
    </div>
  )
}