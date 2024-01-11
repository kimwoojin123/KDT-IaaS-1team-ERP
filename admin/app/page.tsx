import Link from 'next/link'
import ApplyButton from './ui/mainButtons/applyButton'
import InvoiceButton from './ui/mainButtons/invoiceButton'
import ListButton from './ui/mainButtons/listButton'
import ManageButton from './ui/mainButtons/manageButton'

export default function Home(){
  return (
    <div className='flex flex-col justify-center items-center w-lvw h-lvh'>
      <div className='flex w-3/4 h-1/2 flex-wrap justify-around items-center'>
        <ListButton />
        <ApplyButton />
      </div>
      <div className='flex w-3/4 h-1/2 flex-wrap justify-around'>
        <ManageButton />
        <InvoiceButton />
      </div>
    </div>
  )
}