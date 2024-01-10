'use client'

import React, {useState} from "react";
import Link from 'next/link'
import {
  validateName,
  validateUsername,
  validatePassword,
  validateEmail,
  validatePhoneNumber,
} from '../ui/validation';

export default function SignUp(){
  const initialFormData = {
    username: '',
    password: '',
    name: '',
    email: '',
    address: '',
    phoneNumber: '',
  };
  
  const initialValidation = {
    isValidName: true,
    isValidUsername: true,
    isValidPassword: true,
    isValidEmail: true,
    isValidPhoneNumber: true,
  };
  const [formData, setFormData] = useState(initialFormData);
  const [validation, setValidation] = useState(initialValidation);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value,
    });
    setValidation({
      ...validation,
      ['isValid' + name.charAt(0).toUpperCase() + name.slice(1)]: true,
    });
  };


  const handleJoin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name, username, password, email, phoneNumber, address } = formData;
    const isNameValid = validateName(name);
    const isUsernameValid = validateUsername(username);
    const isPasswordValid = validatePassword(password);
    const isEmailValid = validateEmail(email);
    const isPhoneNumberValid = validatePhoneNumber(phoneNumber);

    setValidation({
      isValidName: isNameValid,
      isValidUsername: isUsernameValid,
      isValidPassword: isPasswordValid,
      isValidEmail: isEmailValid,
      isValidPhoneNumber: isPhoneNumberValid,
    });
  
    if (!(isNameValid && isUsernameValid && isPasswordValid && isEmailValid && isPhoneNumberValid)) {
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


  return (
    <div  className="flex flex-col justify-center items-center h-lvh">
      <h1 className="mb-20">회원가입 페이지</h1>
      <form className = "h-32 flex flex-col items-end justify-around" onSubmit={handleJoin}>
      <input
        className={`border border-black mb-2 ${!validation.isValidName ? 'border-red-500' : ''}`}
        type="text"
        value={formData.name}
        name="name"
        placeholder="이름"
        onChange={handleInputChange}
        required 
      />
      <input
        className={`border border-black mb-2 ${!validation.isValidUsername ? 'border-red-500' : ''}`}
        type="text"
        value={formData.username}
        name="username"
        placeholder="아이디"
        onChange={handleInputChange}
        required 
      />
      <input
        className={`border border-black mb-2 ${!validation.isValidPassword ? 'border-red-500' : ''}`}
        type="text"
        value={formData.password}
        name="password"
        placeholder="비밀번호"
        onChange={handleInputChange}
        required 
      />
      <input
        className={`border border-black mb-2 ${!validation.isValidEmail ? 'border-red-500' : ''}`}
        type="text"
        value={formData.email}
        name="email"
        placeholder="이메일"
        onChange={handleInputChange}
        required 
      />
      <input
        className="border border-black mb-2"
        type="text"
        value={formData.address}
        name="address"
        placeholder="주소"
        onChange={handleInputChange}
        required 
      />
      <input
        className={`border border-black mb-2 ${!validation.isValidPhoneNumber ? 'border-red-500' : ''}`}
        type="text"
        value={formData.phoneNumber}
        name="phoneNumber"
        placeholder="전화번호"
        onChange={handleInputChange}
        required 
      />

        <button type="submit">회원가입</button>
      </form>
      <Link className="mt-20" href="/login">로그인페이지로</Link>
    </div>
  )
}