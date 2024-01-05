'use client'


import { useState } from 'react';

export default function Apply() {
  const [category, setCategory] = useState('');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState<File | null>(null)



  const handleImageChange = (event: any) => {
    const selectedImage = event.target.files[0];
    if (selectedImage) {
      console.log('Selected Image:', selectedImage); // 이미지가 선택되었는지 확인
      setImage(selectedImage); // 선택한 이미지를 상태에 설정
    } else {
      console.error('No image selected');
    }
  };


  const handleSubmit = async (event: any) => {
    event.preventDefault();

    try {
      if (!image) {
        throw new Error('이미지를 선택하세요.');
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string; // 이미지를 Base64로 인코딩된 문자열로 가져옴
        const imgName = `${productName}.png`

        const dataToSend = {
          image: imageData,
          cateName: category,
          productName: productName,
          price: price,
          stock: stock,
          imgName: imgName
        };

        // 서버로 JSON 데이터 전송
        fetch('/addProduct', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('상품을 추가하는데 실패했습니다.');
            }
            return response.json();
          })
          .then((data) => {
            console.log(data.message); // 추가된 상품에 대한 메시지 확인
            alert('상품 등록 완료');
          })
          .catch((error) => {
            console.error('Error adding product:', error);
          });
      };
      reader.onerror = () => {
        throw new Error('파일 읽기 오류');
      };
      reader.readAsDataURL(image); // 이미지를 Base64로 인코딩하여 읽음
    } catch (error) {
      console.error('Error:', error);
    }

    // 입력 후 입력 필드 초기화
    setCategory('');
    setProductName('');
    setPrice('');
    setStock('');
    setImage(null);
  };




  return (
    <div className='flex flex-col justify-center items-center w-lvw h-lvh'>
      <h1 className='font-bold text-2xl'>상품 등록</h1><br /><br /><br />
      <form className='flex flex-col justify-between h-1/2' onSubmit={handleSubmit}>
         <div>
          <label>
            이미지 업로드 : 
            <input
              type='file'
              accept='image/*' 
              onChange={handleImageChange}
            />
          </label>
        </div>
        <div>
          <label>
            카테고리 : 
            <input
              className='border-solid border-b border-black outline-0	pl-2'
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            상품명 : 
            <input
            className='border-solid border-b border-black outline-0	pl-2'
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            가격 : 
            <input
            className='border-solid border-b border-black outline-0	pl-2'
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            재고 : 
            <input
            className='border-solid border-b border-black outline-0	pl-2'
              type="text"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </label>
        </div>
        <button className='border-solid rounded-sm border-2 border-black' type="submit">등록</button>
      </form>
    </div>
  );
}