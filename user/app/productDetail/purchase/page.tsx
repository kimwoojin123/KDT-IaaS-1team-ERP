'use client'

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import base64, { decode } from 'js-base64';

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
    { name: string; price: number; productKey: number; quantity: number }[]
  >([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = Object.fromEntries(searchParams);
    if (params.productName && params.price && params.productKey && params.quantity) {
      const productList = params.productName.split(',');
      const productKeyList = params.productKey.split(',');
      const priceList = params.price.split(',').map((price: string) => parseInt(price, 10));
      const quantityList = params.quantity.split(',').map((quantity: string) => parseInt(quantity, 10));

      const productsWithPrices = productList.map((productName, index) => ({
        name: productName,
        price: priceList[index],
        productKey: parseInt(productKeyList[index], 10),
        quantity: quantityList[index],
      }));

      const totalPriceSum = calculateTotalPrice(productsWithPrices);

      setProductsInfo(productsWithPrices);
      setTotalPrice(totalPriceSum);
    }
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

    const data = {
      username: username,
      customer: e.currentTarget.customer.value,
      receiver: e.currentTarget.receiver.value,
      phoneNumber: e.currentTarget.phoneNumber.value,
      address: e.currentTarget.address.value,
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

  return (
    <div className="flex flex-col justify-center items-center w-lvw h-lvh">
      <h1 className="text-2xl font-bold">주문하기</h1>
      <p>배송 정보</p>
      <form onSubmit={handleSubmit}>
        <li className="flex flex-col w-80">
          <label htmlFor="customer">주문 고객</label>
          <input
            className="border border-black"
            type="text"
            name="customer"
            id="customer"
            required
          />
        </li>
        <li className="flex flex-col w-80">
          <label htmlFor="receiver">받는 분</label>
          <input
            className="border border-black"
            type="text"
            name="receiver"
            id="receiver"
            required
          />
        </li>
        <li className="flex flex-col w-80">
          <label htmlFor="phone">휴대폰 번호</label>
          <input
            className="border border-black"
            type="text"
            name="phoneNumber"
            id="phone"
            required
          />
        </li>
        <li className="flex flex-col w-80">
          <label htmlFor="address">배송 주소</label>
          <input
            className="border border-black"
            type="text"
            name="address"
            id="address"
            required
          />
        </li>
        <br />
        <p>선택한 상품 목록:</p>
        <ul>
          {productsInfo.map((product, index) => (
            <li key={index}>
              <img src={`/${product.name}.png`} width={100} height={100} />
              {product.name}: {product.price * product.quantity}원 수량 : 
              {product.quantity}
              <button
                onClick={(e) => {e.preventDefault();
                handleDecrement(index)}}
                disabled={product.quantity <= 1}
              >
                -
              </button>
              
              <button onClick={(e) => {e.preventDefault();
              handleIncrement(index)}}>+</button>
            </li>
          ))}
        </ul>
        <p>총 가격: {totalPrice}원</p>
        <button className="bg-gray-300 w-20 h-10" type="submit">
          결제하기
        </button>
      </form>
    </div>
  );
}