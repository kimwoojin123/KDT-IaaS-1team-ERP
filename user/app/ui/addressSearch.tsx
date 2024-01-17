'use client'

declare global {
  interface Window {
    daum: any;
  }
}

interface IAddr {
  address: string;
  zonecode: string;
}


import Script from 'next/script';
import { useEffect } from 'react';

const Addr = ({ onAddressSelect }: { onAddressSelect: (data: IAddr) => void }) => {
  const openDaumPostcode = () => {
    new window.daum.Postcode({
        oncomplete: function (data: IAddr) {
          onAddressSelect(data);
        },
      }).open();
  };

  useEffect(() => {
    if (!window.daum) {
      // Daum 우편번호 서비스 스크립트 로드
      const script = document.createElement('script');
      script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.async = true;
      script.onload = () => {
        console.log('Daum 우편번호 서비스 스크립트가 로드되었습니다.');
      };
      document.head.appendChild(script);
    }
  }, []);


  return (
    <div>
      <button onClick={(e) => {e.preventDefault(); openDaumPostcode()}}>우편번호 찾기</button>
    </div>
  );
};

export default Addr;


