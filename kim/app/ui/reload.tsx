'use client'
 
import { useRouter } from 'next/navigation'
 
export default function Reload() {
  const router = useRouter()
 
  return (
    <button className='text-2xl' type="button" onClick={() => router.push('/')}>
      DyaBya
    </button>
  )
}