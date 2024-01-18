'use client'

import { useRouter } from "next/navigation"

export default function BackButton(){
  const router = useRouter();
  const handleReturn = () => {
    router.back();
  };
  return (
    <button onClick={handleReturn}>뒤로가기</button>
  )
}