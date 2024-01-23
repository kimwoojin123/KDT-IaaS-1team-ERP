import Link from 'next/link'

export default function UserEditButton() {
  return (
    <Link href="/mypage/userEdit">
        <span className="hover:underline">회원정보수정</span>
    </Link>
  );
}