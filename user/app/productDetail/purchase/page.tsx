'use client'

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import base64, { decode } from 'js-base64';
import Addr, { IAddr } from '@/app/ui/addressSearch';

const getUsernameSomehow = () => {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = decode(payload);
      const payloadObject = JSON.parse(decodedPayload);
      return payloadObject.username;
    } catch (error) {
      console.error('토큰 파싱 오류:', error);
    }
  }

  return null;
};

export default function Purchase() {
  const username = getUsernameSomehow();
  const [productsInfo, setProductsInfo] = useState<
    { name: string; price: number; productKey: number; quantity: number; img:string }[]
  >([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [selectedAddress, setSelectedAddress] = useState<IAddr>({ address: '', zonecode: '' });
  const searchParams = useSearchParams();


  const getProductImage = async (productName: string) => {
    try {
      const response = await fetch(`/getProductImage?productName=${productName}`);
      if (response.ok) {
        const data = await response.json();
        return data.img; // 제품 이미지 경로 반환
      } else {
        console.error('제품 이미지를 가져오는데 실패했습니다.');
        return null;
      }
    } catch (error) {
      console.error('제품 이미지를 가져오는 중 에러 발생:', error);
      return null;
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      const params = Object.fromEntries(searchParams);
      if (params.productName && params.price && params.productKey && params.quantity) {
        const productList = params.productName.split(',');
        const productKeyList = params.productKey.split(',');
        const priceList = params.price.split(',').map((price: string) => parseInt(price, 10));
        const quantityList = params.quantity.split(',').map((quantity: string) => parseInt(quantity, 10));
  
        const productsWithPrices = await Promise.all(productList.map(async (productName, index) => {
          const img = await getProductImage(productName);
          return {
            name: productName,
            price: priceList[index],
            productKey: parseInt(productKeyList[index], 10),
            quantity: quantityList[index],
            img: img,
          };
        }));
  
        const totalPriceSum = calculateTotalPrice(productsWithPrices);
  
        setProductsInfo(productsWithPrices);
        setTotalPrice(totalPriceSum);
      }
    };
  
    fetchData();
  }, [searchParams]);

  const handleIncrement = (index: number) => {
    setProductsInfo((prevProducts) => {
      const updatedProducts = [...prevProducts];
      updatedProducts[index] = {
        ...updatedProducts[index],
        quantity: updatedProducts[index].quantity + 1,
      };
      setTotalPrice(calculateTotalPrice(updatedProducts));
      return updatedProducts;
    });
  };

  const handleDecrement = (index: number) => {
    setProductsInfo((prevProducts) => {
      const updatedProducts = [...prevProducts];
      if (updatedProducts[index].quantity > 1) {
        updatedProducts[index] = {
          ...updatedProducts[index],
          quantity: updatedProducts[index].quantity - 1,
        };
        setTotalPrice(calculateTotalPrice(updatedProducts));
      }
      return updatedProducts;
    });
  };

  const calculateTotalPrice = (
    products: { name: string; price: number; quantity: number }[]
  ) => {
    return products.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fullAddress = `${selectedAddress.address} ${selectedAddress.detailedAddress}`.trim();
    const data = {
      username: username,
      customer: e.currentTarget.customer.value,
      receiver: e.currentTarget.receiver.value,
      phoneNumber: e.currentTarget.phoneNumber.value,
      address: fullAddress,
      price: totalPrice,
      productName: productsInfo.map((product) => product.name).join(','),
      productKey: productsInfo
        .map((product) => product.productKey)
        .join(','),
      quantity: productsInfo.map((product) => product.quantity).join(','),
    };

    try {
      const response = await fetch('/createOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('주문이 성공적으로 생성되었습니다.');
        alert('주문 완료');
        window.location.href = '/';
      } else {
        console.error('주문 생성 실패');
        alert('잔액이 부족합니다');
      }
    } catch (error) {
      console.error('주문 생성 중 에러:', error);
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
  
    // 숫자와 - 외의 문자는 제거
    value = value.replace(/[^\d]/g, '');
  
    // 길이 제한
    if (value.length > 11) {
      value = value.slice(0, 11); // 11자리까지만 유지
    }
  
    // 원하는 형식으로 변환
    if (value.length >= 3 && value.length <= 7) {
      value = value.replace(/(\d{3})(\d{1,4})/, "$1-$2");
    } else if (value.length > 7) {
      value = value.replace(/(\d{3})(\d{4})(\d{1,4})/, "$1-$2-$3");
    }
  
    // 직접 input 요소의 value 속성을 업데이트
    (e.target as HTMLInputElement).value = value;
  };
  
  const handleAddressSelect = (data: IAddr) => {
    setSelectedAddress(data);
  };



  const handleDetailedAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSelectedAddress((prevAddress) => ({ ...prevAddress, detailedAddress: value }));
  };



  return (
    <div className="flex flex-col justify-center items-center w-2/3 mx-auto mt-10 p-8 bg-gray-100 rounded-md">
      <h1 className="text-3xl font-bold mb-4">주문하기</h1>
      <p className="text-lg mb-2">배송정보</p>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex justify-between">
          <div className="w-1/2 pr-4">
            <div className="w-full h-full bg-white px-3 py-4 text-lg rounded-md ">
              <ul>
                {productsInfo.map((product, index) => (
                  <div
                    key={index}
                    className="flex justify-around border mb-2 rounded-md"
                  >
                    <div>
                      <img
                        src={product.img}
                        width={100}
                        height={100}
                      />
                    </div>
                    <div className="flex-col w-44">
                      <p className="font">상품명: {product.name}</p>
                      <div className="flex ">
                        <p className="mr-6">수량: {product.quantity}</p>
                        <div className="flex items-end">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleIncrement(index);
                            }}
                            className="mr-2 bg-gray-300 rounded-md w-5"
                          >
                            +
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleDecrement(index);
                            }}
                            disabled={product.quantity <= 1}
                            className="mr-2 bg-gray-300 rounded-md w-5"
                          >
                            -
                          </button>
                        </div>
                      </div>
                      <p>금액: {product.price * product.quantity}원</p>
                      <div className="flex items-center"></div>
                    </div>
                  </div>
                ))}
              </ul>
            </div>
          </div>
          <div className="w-1/2">
            <div className="mb-4">
              <label htmlFor="customer" className="text-sm">
                주문고객
              </label>
              <input
                className="border border-gray-300 px-3 py-2 text-base rounded-md w-full"
                type="text"
                name="customer"
                id="customer"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="receiver" className="text-sm">
                받는 분
              </label>
              <input
                className="border border-gray-300 px-3 py-2 text-base rounded-md w-full"
                type="text"
                name="receiver"
                id="receiver"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="phone" className="text-sm">
                휴대폰번호
              </label>
              <input
                className="border border-gray-300 px-3 py-2 text-base rounded-md w-full"
                type="text"
                name="phoneNumber"
                id="phone"
                onChange={handlePhoneNumberChange}
                required
              />
            </div>
            <div className="mb-4">
              <div className="flex justify-between">
                <label htmlFor="address" className="text-sm">
                  배송주소
                </label>
                <Addr onAddressSelect={handleAddressSelect} />
              </div>
              <div className="flex items-center w-full">
                <input
                  className="border border-gray-300 px-3 py-2 text-base rounded-md w-full"
                  type="text"
                  name="address"
                  id="address"
                  value={selectedAddress.address}
                  required
                  readOnly
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="addressDetail" className="text-sm">
                상세주소
              </label>
              <input
                className="border border-gray-300 px-3 py-2 text-base rounded-md w-full"
                type="text"
                name="addressDetail"
                id="addressDetail"
                onChange={handleDetailedAddressChange}
                required
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <div className="w-1/2 border border-gray-300 px-3 py-2 text-base rounded-md">
            <div className="flex justify-end items-center mb-4">
              <p className="text-xl mb-2 mr-auto">총 가격 : {totalPrice}원</p>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                type="submit"
              >
                결제하기
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}