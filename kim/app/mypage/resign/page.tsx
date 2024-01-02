'use client'
import { useState } from 'react';
import Link from 'next/link';
import base64, { decode } from "js-base64"

// 사용자의 아이디를 가져오는 함수
const getUsernameSomehow = () => {
  const token = localStorage.getItem("token");
  
  if (token) {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = decode(payload);
      const payloadObject = JSON.parse(decodedPayload);
      return payloadObject.username
    } catch (error) {
      console.error("Error parsing token:", error);
    }
  }

  return null;
};

export default function Resign() {
  const [message, setMessage] = useState("");

  const handleResign = async () => {
    try {
      const username = getUsernameSomehow(); // 사용자의 아이디 가져오기

      if (username) {
        const response = await fetch("/resign", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        });

        if (response.ok) {
          setMessage("회원 탈퇴가 완료되었습니다.");
          // 회원 탈퇴 후 추가적인 동작 수행 (예: 로그아웃 등)
          // ...
        } else {
          setMessage("회원 탈퇴에 실패했습니다.");
        }
      } else {
        setMessage("사용자 아이디를 가져올 수 없습니다.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("회원 탈퇴 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <h1>회원 탈퇴하기</h1>
      <button onClick={handleResign}>회원 탈퇴</button>
      {message && <p>{message}</p>}<br />
      <Link href="/">메인페이지로</Link>
    </div>
  );
}