'use client'

import React, {useState} from "react";
import Link from 'next/link'


export default function SignUp(){
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAdress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isValidUsername, setIsValidUsername] = useState(true);

  const handleJoin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isUsernameValid = validateUsername(username);
    if (!isUsernameValid) {
      setIsValidUsername(false);
      return;
    }

    try {
      const response = await fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, username, password, email, address, phoneNumber }),
      });
      
      if (response.ok) {
        alert('회원가입이 완료되었습니다')
        window.location.href='/'
      } else {
        alert('회원가입에 실패하였습니다.')
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const validateUsername = (username) => {
    const isValid = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,12}$/.test(username);
    return isValid;
  };

  return (
    <div  className="flex flex-col justify-center items-center h-lvh">
      <h1 className="mb-20">회원가입 페이지</h1>
      <form className = "h-32 flex flex-col items-end justify-around" onSubmit={handleJoin}>
        <input className="border border-black mb-2" type="text" value={name} placeholder="이름" onChange={(e) => setName(e.target.value)} />
        <input className={`border border-black mb-2 ${!isValidUsername ? 'border-red-500' : ''}`} type="text" value={username} placeholder="아이디" onChange={(e) => {setUsername(e.target.value); setIsValidUsername(true);}} />
        <input className="border border-black mb-2" type="text" value={password} placeholder="비밀번호" onChange={(e) => setPassword(e.target.value)} />
        <input className="border border-black mb-2" type="text" value={email} placeholder="이메일" onChange={(e) => setEmail(e.target.value)} />
        <input className="border border-black mb-2" type="text" value={address} placeholder="주소" onChange={(e) => setAdress(e.target.value)} />
        <input className="border border-black mb-2" type="text" value={phoneNumber} placeholder="전화번호" onChange={(e) => setPhoneNumber(e.target.value)} />
        <button type="submit">회원가입</button>
      </form>
      <Link className="mt-20" href="/login">로그인페이지로</Link>
    </div>
  )
}