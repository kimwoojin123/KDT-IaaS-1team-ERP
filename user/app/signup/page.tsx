'use client'

import React, {useState} from "react";
import Link from 'next/link'
import {
  validateName,
  validateUsername,
  validatePassword,
  validateEmail,
} from '../ui/validation';
import Addr, { IAddr } from "../ui/addressSearch";



export default function SignUp(){
  const initialFormData = {
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    email: '',
    address: '',
    phoneNumber: '',
    detailedAddress: '',
  };
  
  const initialValidation = {
    isValidName: true,
    isValidUsername: true,
    isValidPassword: true,
    isValidConfirmPassword: true,
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

    if (name === 'confirmPassword') {
      setValidation({
        ...validation,
        isValidConfirmPassword: formData.password === value,
      });
    } else {
      setValidation({
        ...validation,
        ['isValid' + name.charAt(0).toUpperCase() + name.slice(1)]: true,
      });
    }
  };

  const handleJoin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name, username, password, email, phoneNumber } = formData;
    const isNameValid = validateName(name);
    const isUsernameValid = validateUsername(username);
    const isPasswordValid = validatePassword(password);
    const isEmailValid = validateEmail(email);
    const isConfirmPasswordValid = formData.password === formData.confirmPassword;
    const isPhoneNumberValid = formData.phoneNumber.match(/^\d{3}-\d{4}-\d{4}$/) !== null;

    setValidation({
      isValidName: isNameValid,
      isValidUsername: isUsernameValid,
      isValidPassword: isPasswordValid,
      isValidConfirmPassword: isConfirmPasswordValid,
      isValidEmail: isEmailValid,
      isValidPhoneNumber: isPhoneNumberValid,

    });
  
    if (!(isNameValid && isUsernameValid && isPasswordValid && isEmailValid && isConfirmPasswordValid && isPhoneNumberValid)) {
      return;
    }

    try {
      const fullAddress = `${formData.address} ${formData.detailedAddress}`.trim();
      const response = await fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, username, password, email, address:fullAddress, phoneNumber }),
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

  const handleAddressSelect = (data: IAddr) => {
    // 주소 선택 시 부모 컴포넌트 상태 업데이트
    setFormData({
      ...formData,
      address: data.address,
    });
  };


  const handleDetailedAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setFormData({
      ...formData,
      detailedAddress: value,
    });
  };


  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
  
    // 숫자와 - 외의 문자는 제거
    value = value.replace(/[^\d]/g, '');
  
    // 길이 제한
    if (value.length > 11) {
      return;
    }
  
    // 원하는 형식으로 변환
    if (value.length >= 3 && value.length <= 7) {
      value = value.replace(/(\d{3})(\d{1,4})/, "$1-$2");
    } else if (value.length > 7) {
      value = value.replace(/(\d{3})(\d{4})(\d{1,4})/, "$1-$2-$3");
    }
  
    setFormData({
      ...formData,
      phoneNumber: value
    });
  
    // 전화번호 유효성 검사
    const isPhoneNumberValid = value.match(/^\d{3}-\d{4}-\d{4}$/) !== null;
    
    
    if (!e.currentTarget.checkValidity()) {
      setValidation({
        ...validation,
        isValidPhoneNumber: isPhoneNumberValid,
      });
    }
  };


  const checkUsername = async () => {
    const { username } = formData;
  
    const isUsernameValid = validateUsername(username);

    if (!isUsernameValid) {
      alert('아이디 형식이 유효하지 않습니다. 6~12글자,영문,숫자로 작성하세요(특수문자 제한)');
      return;
    }

    try {
      const response = await fetch(`/checkUsername`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
  
      if (response.ok) {
        const data = await response.json();
  
        if (data.isDuplicate) {
          alert('이미 사용 중인 아이디입니다.');
        } else {
          alert('사용 가능한 아이디입니다.');
        }
      } else {
        alert('중복 조회에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error checking duplicate username:', error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="mb-10 text-3xl font-bold">회원가입 페이지</h1>
      <form className="w-full max-w-md" onSubmit={handleJoin}>
        <div className="mb-6 flex flex-col">
          <div className="relative mb-4 flex items-center">
            <div className="w-full">
              <input
                className={`w-full border p-2 ${
                  !validation.isValidName ? "border-red-500" : "border-black"
                }`}
                type="text"
                value={formData.name}
                name="name"
                placeholder="이름"
                onChange={handleInputChange}
              />
              {validation.isValidName ? null : (
                <p className="text-red-500 text-xs mt-1">이름을 확인하세요</p>
              )}
            </div>
          </div>
          <div className="relative mb-4 flex items-center">
            <div className="w-full">
              <input
                className={`w-full border p-2 ${
                  !validation.isValidUsername
                    ? "border-red-500"
                    : "border-black"
                }`}
                type="text"
                value={formData.username}
                name="username"
                placeholder="아이디"
                onChange={handleInputChange}
              />
              {!validation.isValidUsername && (
                <p className="text-red-500 text-xs mt-1">
                  6~12글자, 영문, 숫자로 작성하세요 (특수문자 제한)
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={checkUsername}
              className="bg-blue-500 w-32 h-12 text-white py-0 px-4 rounded ml-2"
            >
              중복조회
            </button>
          </div>
          <div className="relative mb-4 flex items-center">
            <div className="w-full">
          <input
            className={`w-full border p-2 border-black ${
              !validation.isValidPassword ? "border-red-500" : ""
            }`}
            type="password"
            value={formData.password}
            name="password"
            placeholder="비밀번호"
            onChange={handleInputChange}
          />
          {!validation.isValidPassword && (
                <p className="text-red-500 text-xs mt-1">
                8~20글자, 영문,숫자,특수문자로 작성하세요
            </p>
          )}
          </div>
          </div>
          <input
            className={`w-full border p-2 mb-4 border-black ${
              !validation.isValidConfirmPassword ? "border-red-500" : ""
            }`}
            type="password" // 추가: 비밀번호 필드로 변경
            value={formData.confirmPassword}
            name="confirmPassword"
            placeholder="비밀번호 확인"
            onChange={handleInputChange}
          />
          {!validation.isValidConfirmPassword && (
            <p style={{ color: "red", fontSize: 10 }}>
              비밀번호가 일치하지 않습니다
            </p>
          )}
          <div className="relative mb-4 flex items-center">
            <div className="w-full">
              <input
                className={`w-full border p-2 ${
                  !validation.isValidEmail ? "border-red-500" : "border-black"
                }`}
                type="text"
                value={formData.email}
                name="email"
                placeholder="이메일"
                onChange={handleInputChange}
              />
              {validation.isValidEmail ? null : (
                <p className="text-red-500 text-xs mt-1">
                  이메일을 다시 확인 후 입력해주세요
                </p>
              )}
            </div>
          </div>
          <input
            className={`w-full border p-2 ${
              !validation.isValidPhoneNumber ? "border-red-500" : "border-black"
            }`}
            type="text"
            value={formData.phoneNumber}
            name="phoneNumber"
            placeholder="전화번호"
            onChange={handlePhoneNumberChange}
          />
          <div className="w-full">
            {validation.isValidPhoneNumber ? null : (
              <p className="text-red-500 text-xs mt-1">
                " - "를 사용하여 작성해주세요.
              </p>
            )}
          </div>
          <div className="relative flex items-center">
            <div className="w-full">
              <div className="flex justify-end">
                <Addr onAddressSelect={handleAddressSelect} />
              </div>
              <input
                className="w-full border p-2 mb-4 border-black"
                type="text"
                value={formData.address}
                name="address"
                placeholder="주소"
                onChange={handleInputChange}
              />
              <input
                className="w-full border p-2 border-black"
                type="text"
                value={formData.detailedAddress}
                name="detailedAddress"
                placeholder="상세주소"
                onChange={handleDetailedAddressChange}
              />
              <div className="relative mb-4 flex items-center"></div>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white py-2 px-4 rounded mt-4 w-full"
        >
          가입하기
        </button>
      </form>
      <Link className="mt-8" href="/login">
        로그인페이지로
      </Link>
    </div>
  );
}