'use client'

import { useState, useEffect } from 'react';

interface Product {
  cateName : string
  productName : string
  price: string
  stock : string
  productKey : Number
}


export default function List() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);


  useEffect(() => {
    fetch('/products')
      .then((response) => {
        if (!response.ok) {
          throw new Error('상품 정보를 가져오는데 실패했습니다.');
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

  const handleCheckboxChange = (index: number) => {
    const selectedIndex = selectedProducts.indexOf(index);
    if (selectedIndex === -1) {
      setSelectedProducts([...selectedProducts, index]);
    } else {
      const updatedSelected = selectedProducts.filter((item) => item !== index);
      setSelectedProducts(updatedSelected);
    }
  };

  const handleDelete = async () => {
    try {
      const deleteRequests = selectedProducts.map((index) => {
        const productId = products[index].productKey;
        return fetch(`/deleteProduct/${productId}`, {
          method: 'DELETE',
        })
        .then((response) => {
          if (!response.ok) {
            throw new Error('상품 삭제에 실패했습니다.');
          }
          return response.json();
        });
      });
  
      const deleteResults = await Promise.all(deleteRequests);
  
      // 삭제 요청 결과 확인
      const isDeleteSuccess = deleteResults.every((result) => result.message === '상품이 성공적으로 삭제되었습니다.');
  
      if (isDeleteSuccess) {
        // 삭제 성공 시 화면 갱신
        const updatedProducts = products.filter((_, index) => !selectedProducts.includes(index));
        setProducts(updatedProducts);
        setSelectedProducts([]);
      } else {
        throw new Error('일부 상품이 삭제되지 않았습니다.');
      }
    } catch (error) {
      console.error('Error deleting products:', error);
    }
  };


  return (
    <div className='flex flex-col justify-center items-center w-lvw h-lvh'>
      <h1 className='text-2xl font-bold'>상품목록</h1><br />
      <button onClick={handleDelete}>상품 삭제</button>
      <table className='w-80 border-solid border-2 border-black	'>
        <thead  className='border-b-2 border-solid border-black' >
          <tr>
            <th className='text-right'>선택</th>
            <th className='text-right'>카테고리</th>
            <th className='text-right'>상품명</th>
            <th className='text-right'>가격</th>
            <th className='text-right'>재고</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td className='text-center'>
                <input
                  type='checkbox'
                  checked={selectedProducts.includes(index)}
                  onChange={() => handleCheckboxChange(index)}
                />
              </td>
              <td className='text-right'>{product.cateName}</td>
              <td className='text-right'>{product.productName}</td>
              <td className='text-right'>{product.price}원</td>
              <td className='text-right'>{product.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}