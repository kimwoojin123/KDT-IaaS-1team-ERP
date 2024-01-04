import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function PurchaseButton({ productName, price }: { productName: string, price: string }){
  const router = useRouter();

  const handlePurchaseClick = () => {
    const token = localStorage.getItem('token');

    if (token) {
      router.push(`/productDetail/purchase?productName=${encodeURIComponent(productName)}&price=${encodeURIComponent(price)}`);
    } else {
      alert('로그인이 필요합니다.');
    }
  };


  return (
    <div className="flex justify-center items-center bg-gray-300 w-10 h-7" >
    <button onClick={handlePurchaseClick}>구매</button>
    </div>
  )
}