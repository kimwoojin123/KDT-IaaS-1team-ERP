import './globals.css'
import Link from 'next/link'


export default function Home () {
  return (
    <>
    <div className='box'><Link href="/list">List</Link></div>
          <div className='box'><Link href="/registeration">Registration</Link></div>
          <div className='box'><Link href="/management">Management</Link></div>
          <div className='box'><Link href="/usermanagement">User-management</Link></div>
    </>
  )
}
