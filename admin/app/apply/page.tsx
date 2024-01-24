'use client'

// 'use client' 주석 추가
import { useState, useEffect, useRef } from 'react';

// 카테고리 타입 정의
type Category = {
  cateName: string;
};

export default function Apply() {
  // 상태 변수 초기화
  const [category, setCategory] = useState<Category[]>([]);
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [standard, setStandard] = useState('');
  const [isInitialCategory, setIsInitialCategory] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 규격 옵션 리스트
  const standardList = ["특", "대", "중", "소"];

  // 폼 제출 핸들러
  const handleSubmit = async (event: any) => {
    event.preventDefault();

    // FormData 생성
    const formData = new FormData();

    // 이미지가 존재하면 FormData에 추가
    if (image) {
      formData.append('image', image);
    }

    // 입력된 데이터를 FormData에 추가
    formData.append('cateName', selectedCategory);
    formData.append('productName', productName);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('standard', standard);

    try {
      // 상품 등록 API 호출
      const response = await fetch('/addProduct', {
        method: 'POST',
        body: formData,
      });

      // 응답이 성공적이지 않으면 에러 처리
      if (!response.ok) {
        const errorMessage = response.status === 400 ? '해당 상품명이 이미 존재합니다.' : '상품을 등록하는데 실패했습니다.';
        throw new Error(errorMessage);
      }

      // 응답 데이터 출력 및 알림
      const data = await response.json();
      console.log(data.message);
      alert('상품 등록 완료');
    } catch (error) {
      console.error('Error adding product:', error);
      alert((error as Error).message);
    }

    // 이미지 업로드 후 입력값 초기화
    if (fileInputRef.current) {
      (fileInputRef.current as HTMLInputElement).value = '';
    }

    setSelectedCategory('');
    setProductName('');
    setPrice('');
    setStock('');
    setStandard('');
    setImage(null);
  };

  // 페이지 로드 시 카테고리 목록 불러오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/category');
        if (!response.ok) {
          throw new Error('카테고리를 불러오는데 실패했습니다.');
        }
        const data = await response.json();
        setCategory(data); // 서버에서 받은 카테고리 배열로 설정
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // 이미지 변경 핸들러
  const handleImageChange = (event: any) => {
    const selectedImage = event.target.files[0];
    setImage(selectedImage);
  };

  // JSX 반환
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">상품 등록</h1>
      <div className="flex justify-center mt-3">
        <form
          className="flex flex-col"
          onSubmit={handleSubmit}
        >
          {/* 이미지 업로드 입력 */}
          <div className="mb-4">
            <label className="text-2xl font-bold" style={{ lineHeight: "2" }}>
              이미지 업로드 :
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-2 w-full max-w-md"
                ref={fileInputRef}
              />
            </label>
          </div>
          {/* 카테고리 선택 입력 */}
          <div className="mb-4">
            <label className="text-2xl font-bold" style={{ lineHeight: '2' }}>
              카테고리 :
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border-b outline-none pl-2 w-full border border-gray-300"
              >
                {isInitialCategory && (
                  <option value="" disabled hidden>
                    카테고리를 선택해주세요.
                  </option>
                )}
                {/* 카테고리 옵션 렌더링 */}
                {category.map((cate) => (
                  <option key={cate.cateName} value={cate.cateName}>
                    {cate.cateName}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {/* 상품명, 가격, 재고, 규격 입력 */}
          <div className="mb-4">
            <label className="text-2xl font-bold" style={{ lineHeight: "2" }}>
              상품명 :
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="border-b outline-none pl-2 w-full border border-gray-300"
              />
            </label>
          </div>
          {/* 가격 입력 */}
          <div className="mb-4">
            <label className="text-2xl font-bold" style={{ lineHeight: "2" }}>
              가격 :
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="border-b outline-none pl-2 w-full border border-gray-300"
              />
            </label>
          </div>
          {/* 재고 입력 */}
          <div className="mb-4">
            <label className="text-2xl font-bold" style={{ lineHeight: "2" }}>
              재고 :
              <input
                type="text"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="border-boutline-none pl-2 w-full border border-gray-300"
              />
            </label>
          </div>
          {/* 규격 선택 입력 */}
          <div className="mb-4">
            <label className="text-2xl font-bold" style={{ lineHeight: "2" }}>
              규격 :
              <select
                value={standard}
                onChange={(e) => setStandard(e.target.value)}
                className="border-b outline-none pl-2 w-full border border-gray-300"
              >
                <option value="" disabled hidden>
                  규격을 선택해주세요.
                </option>
                {/* 규격 옵션 렌더링 */}
                {standardList.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {/* 상품 등록 버튼 */}
          <button
            className="bg-blue-500 text-white px-5 py-3 rounded-md text-xl"
            type="submit"
          >
            등록
          </button>
        </form>
      </div>
    </div>
  );
}
