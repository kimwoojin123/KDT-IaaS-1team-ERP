'use client'

import React, {useState} from "react";
import Link from 'next/link'


export default function FindUserInfo(){

  // const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");
  // const [message, setMessage] = useState("");

  
  return (
    <div  className="flex flex-col justify-center items-center h-lvh">
      <h1 className="mb-10">ID/PW 찾기</h1>
      <Link className="mt-10" href="/">메인페이지로</Link>
    </div>
  )
}