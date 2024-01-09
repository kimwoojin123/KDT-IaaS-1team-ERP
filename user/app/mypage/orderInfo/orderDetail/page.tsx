'use client'

import { useSearchParams } from 'next/navigation';


export default function OrderDetail(){
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams);

  const { productName, customer, receiver, phoneNumber, address, price } = params;

  return (
    <div>
      <h1>Order Detail</h1>
      <p>Product Name: {productName}</p>
      <p>Customer: {customer}</p>
      <p>Receiver: {receiver}</p>
      <p>Phone Number: {phoneNumber}</p>
      <p>Address: {address}</p>
      <p>Price: {price}</p>
    </div>
  );
}