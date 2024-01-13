// FooterButton.js

import React from 'react';

const FooterButton = () => {
  // 실제 회사 정보로 덮어쓰기 전에 더미 정보를 실제 정보로 교체할 수 있습니다.
  const companyInfo = {
    name: '회사명',
    phoneNumber: '010-1234-5678',
    email: 'info@company.com',
    address: '서울특별시 강남구 삼성동 123번지',
    businessNumber: '123-45-67890',
  };

  return (
    <div className="footer-button-container">
      <h2>{companyInfo.name}</h2>
      <p>전화번호: {companyInfo.phoneNumber}</p>
      <p>이메일: {companyInfo.email}</p>
      <p>주소: {companyInfo.address}</p>
      <p>사업자 등록 번호: {companyInfo.businessNumber}</p>
    </div>
  );
};

export default FooterButton;
