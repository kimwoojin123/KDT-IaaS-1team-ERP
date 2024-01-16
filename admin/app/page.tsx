import Link from 'next/link'
import ApplyButton from './ui/mainButtons/applyButton'
import InvoiceButton from './ui/mainButtons/invoiceButton'
import ListButton from './ui/mainButtons/listButton'
import ManageButton from './ui/mainButtons/manageButton'
import QnaButton from './ui/mainButtons/qnaButton'
import SaleChart from './ui/saleChart'
import { TopProductSection, ProductPreferenceChart } from './ui/totalChart'

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
        <QnaButton />
      </div>
      <div>
        <SaleChart />
        <div className='flex'>
          <TopProductSection />
          <ProductPreferenceChart />
        </div>
      </div>
    </div>
  )
}