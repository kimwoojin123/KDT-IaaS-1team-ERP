import Link from 'next/link'
import Lottie from "react-lottie-player";

import lottieJson from "/public/404Lottie.json";

export default function NotFound() {
  return (
    <div className='flex flex-col justify-center items-center w-lvw h-90vh'>
      <h2>status 404 - Not Found</h2>
      <p>요청하신 페이지를 찾을 수 없습니다</p>
      <Link href="/" className='border border-style: solid;'>메인 페이지로 이동</Link>
    </div>
  )
}