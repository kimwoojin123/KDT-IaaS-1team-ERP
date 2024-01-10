'use client'

import React, {useState} from "react";
import Link from 'next/link'


export default function SignUp(){
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const containsInvalidCharacters = (input: string): boolean => {
    // 유효하지 않은 문자를 포함하는지 검사하는 정규식
    return !/^[a-zA-Z0-9]+$/.test(input);
  };
  
  const handleJoin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    // 이름, 아이디, 비밀번호에 유효하지 않은 문자가 포함되어 있는지 검사
    if (containsInvalidCharacters(name) || containsInvalidCharacters(username) || containsInvalidCharacters(password)) {
      setMessage("이름, 아이디에는 문자와 숫자만 포함할 수 있습니다.");
      return;
    }
  
    try {
      const response = await fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, username, password }),
      });
  
      if (response.ok) {
        setMessage("회원가입이 완료되었습니다.");
      } else {
        setMessage("회원가입에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("회원가입 중 오류가 발생했습니다.");
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