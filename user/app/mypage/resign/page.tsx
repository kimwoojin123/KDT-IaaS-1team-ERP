'use client'
import { useState } from 'react';
import base64, { decode } from "js-base64"

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
          localStorage.removeItem("token");
          window.location.href='/'          // ...
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
    <div className='flex flex-col justify-center items-center w-lvw h-lvh'>
      <h1 className='font-bold'>정말 탈퇴하시겠습니까?</h1><br />
      <button onClick={handleResign}>탈퇴하기</button>
    </div>
  );
}