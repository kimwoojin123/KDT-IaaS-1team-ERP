<<<<<<< HEAD
import Link from 'next/link'
import ApplyButton from './ui/mainButtons/applyButton'
import InvoiceButton from './ui/mainButtons/invoiceButton'
import ListButton from './ui/mainButtons/listButton'
import ManageButton from './ui/mainButtons/manageButton'
import QnaButton from './ui/mainButtons/qnaButton'
import SaleChart from './ui/saleChart'
import { TopProductSection, ProductPreferenceChart, CategorySalesChart } from './ui/totalChart'

export default function Home(){
=======
import Link from 'next/link';
import ApplyButton from './ui/mainButtons/applyButton';
import InvoiceButton from './ui/mainButtons/invoiceButton';
import ListButton from './ui/mainButtons/listButton';
import ManageButton from './ui/mainButtons/manageButton';
import QnaButton from './ui/mainButtons/qnaButton';
import SaleChart from './ui/saleChart';

export default function Home() {
>>>>>>> origin/work2
  return (
    <div className='flex mt-10'>
      {/* 카테고리 부분 */}
      <div className='w-1/6 h-full flex flex-col justify-around items-center mt-8'>
        <ListButton />
        <ApplyButton />
        <ManageButton />
        <InvoiceButton />
        <QnaButton />
      </div>
<<<<<<< HEAD
      <div className='flex w-svw justify-center opacity-0 animate-fade-in'>
        <div className='mr-10'>
        <SaleChart />
        </div>
        <div className='flex justify-around w-4/12 h-48 border rounded-md'>
          <div>
          <TopProductSection />
            </div>
          <div>
            <ProductPreferenceChart />
          </div>
          <div>
            <CategorySalesChart />
          </div>
=======

      <div className='w-5/6 h-full overflow-hidden flex flex-col items-center'>
        <div className='w-3/4 h-1/3 mb-4 overflow-hidden'>
          <SaleChart />
>>>>>>> origin/work2
        </div>
      </div>
    </div>
  );
}
