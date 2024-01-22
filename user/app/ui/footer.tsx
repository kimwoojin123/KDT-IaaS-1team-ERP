'use client'

import React from 'react';

const Footer = () => {
  const companyInfo = {
    name: 'DYABYA',
    phoneNumber: '010-1234-5678',
    email: 'DYABYA@green.com',
    address: '대전광역시 서구 대덕대로 182 오라클빌딩 305호',
    businessNumber: '123-45-67890',
  };

  return (
    <div className="footer-button-container bg-gray-200 p-4 rounded-md">
      <h2 className="text-lg font-semibold">{companyInfo.name}</h2>
      <p className="text-sm">전화번호: {companyInfo.phoneNumber}</p>
      <p className="text-sm">이메일: {companyInfo.email}</p>
      <p className="text-sm">주소: {companyInfo.address}</p>
      <p className="text-sm">사업자 등록 번호: {companyInfo.businessNumber}</p>
    </div>
  );
};

export default Footer;