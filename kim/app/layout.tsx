
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/ui/globals.css';
import Reload from './ui/reload'
import Link from 'next/link'
import LoginButton from './ui/login'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DyaBya ERP',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className='flex w-lvw h-20 items-center pl-10'> 
            <Reload />
        <div className='w-40 flex justify-between relative left-3/4'>
            <LoginButton />
          <div className='flex justify-center items-center bg-gray-300 w-16 h-9'>
            <Link className="text-sm" href="/signup">회원가입</Link>
          </div>
        </div>
      </div>
      {children}
      </body>
    </html>
  )
}
