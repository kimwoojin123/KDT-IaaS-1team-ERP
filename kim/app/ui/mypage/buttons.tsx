import Link from 'next/link';


export function ResignButton(){
  return (
    <Link 
      href="/mypage/resign"
    >
      <span className = "hover:underline-offset-4">회원탈퇴</span>
    </Link>
  )
}