import Link from 'next/link'

export default function PurchaseButton(){
  return (
    <Link className="flex justify-center items-center bg-gray-300 w-10 h-7" href="purchase">구매</Link>
  )
}