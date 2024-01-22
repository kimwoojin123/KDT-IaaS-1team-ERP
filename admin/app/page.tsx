import Link from 'next/link';
import ApplyButton from './ui/mainButtons/applyButton';
import InvoiceButton from './ui/mainButtons/invoiceButton';
import ListButton from './ui/mainButtons/listButton';
import ManageButton from './ui/mainButtons/manageButton';
import QnaButton from './ui/mainButtons/qnaButton';
import SaleChart from './ui/saleChart';

export default function Home() {
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

      <div className='w-5/6 h-full overflow-hidden flex flex-col items-center'>
        <div className='w-3/4 h-1/3 mb-4 overflow-hidden'>
          <SaleChart />
        </div>
      </div>
    </div>
  );
}
