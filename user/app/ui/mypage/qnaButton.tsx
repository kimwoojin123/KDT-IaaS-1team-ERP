import Link from 'next/link'

export default function QnaButton() {
  return (
    <Link href="/mypage/board">
        <span className="hover:underline">고객문의</span>
    </Link>
  );
}