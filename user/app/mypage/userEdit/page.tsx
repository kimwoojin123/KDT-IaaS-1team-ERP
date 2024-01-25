'use client'

import React, {useState, useEffect} from "react";
import { validatePassword, validateEmail } from "@/app/ui/validation";
import Addr, { IAddr } from "@/app/ui/addressSearch";
import base64, { decode } from "js-base64";


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
}

interface UserData {
  name: string;
  username: string;
}

export default function UserEdit(){
  const initialFormData = {
    password: '',
    confirmPassword: '',
    email: '',
    address: '',
    phoneNumber: '',
    detailedAddress: '',
  };

  const initialValidation = {
    isValidPassword: true,
    isValidConfirmPassword: true,
    isValidEmail: true,
    isValidPhoneNumber: true,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [validation, setValidation] = useState(initialValidation);
  const [userData, setUserData] = useState<UserData[]>([]);
  const username = getUsernameSomehow();



  useEffect(()=> {

    if (!username) {
      console.error('사용자명을 찾을 수 없습니다.');
      return;
    }

    fetch(`/users?username=${username}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('유저 데이터를 가져오는데 실패했습니다.');
      }
      return response.json();
    })
    .then((data) => {
      setUserData(data);
      console.log(data)
    })
    .catch((error) => {
      console.error('Error fetching user cart:', error);
    });
  },[])




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


  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { password, email, phoneNumber } = formData;
    const isPasswordValid = validatePassword(password);
    const isEmailValid = validateEmail(email);
    const isConfirmPasswordValid = formData.password === formData.confirmPassword;
    const isPhoneNumberValid = formData.phoneNumber.match(/^\d{3}-\d{4}-\d{4}$/) !== null;

    setValidation({
      isValidPassword: isPasswordValid,
      isValidConfirmPassword: isConfirmPasswordValid,
      isValidEmail: isEmailValid,
      isValidPhoneNumber: isPhoneNumberValid,

    });
  
    if (!(isPasswordValid && isEmailValid && isConfirmPasswordValid && isPhoneNumberValid)) {
      return;
    }

    try {
      const fullAddress = `${formData.address} ${formData.detailedAddress}`.trim();
      const response = await fetch("/userEdit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email, address:fullAddress, phoneNumber }),
      });
      
      if (response.ok) {
        alert('회원정보 수정이 완료되었습니다')
        window.location.href='/'
      } else {
        alert('회원정보 수정에 실패하였습니다.')
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



  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="mb-10 text-3xl font-bold">회원정보수정</h1>
      <form className="w-full max-w-md" onSubmit={handleEdit}>
        <div className="mb-6 flex flex-col">
          <div className="relative mb-4 flex items-center">
            <div className="w-full">
              <input
                className="w-full border p-2"
                type="text"
                value={userData[0]?.name || ''}
                name="name"
                readOnly
              />
            </div>
          </div>
          <div className="relative mb-4 flex items-center">
            <div className="w-full">
              <input
                className="w-full border p-2"
                type="text"
                value={userData[0]?.username || ''}
                name="username"
                readOnly
              />
            </div>
          </div>
          <input
            className={`w-full border p-2 mb-4 border-black ${
              !validation.isValidPassword ? "border-red-500" : ""
            }`}
            type="password"
            value={formData.password}
            name="password"
            placeholder="비밀번호"
            onChange={handleInputChange}
          />
          {!validation.isValidPassword && (
            <p style={{ color: "red", fontSize: 10 }}>
              8~20글자, 영문,숫자,특수문자로 작성하세요
            </p>
          )}
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
          수정하기
        </button>
      </form>
    </div>
  )
}