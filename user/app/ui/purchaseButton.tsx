import Link from 'next/link'

export default function PurchaseButton({ productName, price }: { productName: string, price: string }){
  const href = `/productDetail/purchase?productName=${encodeURIComponent(productName)}&price=${encodeURIComponent(price)}`;

  return (
    <Link className="flex justify-center items-center bg-gray-300 w-10 h-7" href={href}>구매</Link>
  )
}