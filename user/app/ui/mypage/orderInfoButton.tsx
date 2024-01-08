import Link from 'next/link'

export default function OrderInfoButton() {
  return (
    <Link href="/mypage/orderInfo">
        <span className="hover:underline">주문 정보</span>
    </Link>
  );
}