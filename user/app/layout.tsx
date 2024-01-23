
import type { Metadata } from 'next'
import '@/app/ui/globals.css';
import Reload from './ui/layoutButtons/reloadButton'
import LoginButton from './ui/layoutButtons/loginButton'
import MyPageButton from './ui/layoutButtons/mypagebutton';
import SignupButton from './ui/layoutButtons/signupButton';
import CartButton from './ui/layoutButtons/cartButton';
import MyStatus from './ui/status';
import BoardButton from './ui/layoutButtons/boardButton';
import Footer from './ui/footer';

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
    <html lang="en" className="h-screen">
      <body className="h-screen">
        <div className='flex w-screen h-20 items-center space-x-4'> 
          <Reload />
          <div>
            <MyStatus />
          </div>
          <div className='w-screen flex left-3/4 space-x-4'>
            <div>
              <CartButton />
            </div>
            <div>
              <MyPageButton />
            </div>
            <div>
              <BoardButton />
            </div>            
            <LoginButton />
            <div>
              <SignupButton />
            </div>
          </div>
        </div>
        {children}
      </body>
    </html>
  );}