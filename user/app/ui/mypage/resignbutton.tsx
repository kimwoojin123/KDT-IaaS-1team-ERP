import Link from 'next/link'

export default function ResignButton() {
  return (
    <Link href="/mypage/resign">
        <span className="hover:underline">회원탈퇴</span>
    </Link>
  );
}