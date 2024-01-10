import Link from 'next/link'

export default function Home(){
  return (
    <div className='flex flex-col justify-center items-center w-lvw h-lvh'>
      <div className='flex w-3/4 h-1/2 flex-wrap justify-around items-center'>
        <Link className="flex justify-center items-center bg-gray-300 w-48 h-32" href='list'>
          <span>상품목록</span>
        </Link>
        <Link className="flex justify-center items-center bg-gray-300 w-48 h-32" href='apply'>
          <span>상품등록</span>
        </Link>
      </div>
      <div className='flex w-3/4 h-1/2 flex-wrap justify-around'>
        <Link className="flex justify-center items-center bg-gray-300 w-48 h-32" href='manage'>
          <span>유저관리</span>
        </Link>
        <Link className="flex justify-center items-center bg-gray-300 w-48 h-32" href='invoice'>
          <span>주문조회</span>
        </Link>
      </div>
    </div>
  )
}