import Link from 'next/link'

export default function ResignButton() {
  return (
    <Link href="/mypage/userEdit">
        <span className="hover:underline">회원탈퇴</span>
    </Link>
  );
}