import Link from 'next/link';
import ApplyButton from './ui/mainButtons/applyButton';
import InvoiceButton from './ui/mainButtons/invoiceButton';
import ListButton from './ui/mainButtons/listButton';
import ManageButton from './ui/mainButtons/manageButton';
import QnaButton from './ui/mainButtons/qnaButton';

export default function Home() {
  return (
    <div className='flex flex-col justify-center items-center w-lvw h-lvh'>
      <div className='flex w-3/4 h-1/2 justify-around items-center'>
        <ListButton />
        <ApplyButton />
        <ManageButton />
        <InvoiceButton />
        <QnaButton />
      </div>
      <div className='flex w-3/4 h-1/2 flex-wrap justify-around'>
      </div>
    </div>
  );
}
