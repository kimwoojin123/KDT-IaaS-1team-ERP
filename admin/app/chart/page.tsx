import SaleChart from "../ui/saleChart"
import { TopProductSection, ProductPreferenceChart, CategorySalesChart } from "../ui/totalChart"


export default function Chart(){
  return (
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
    </div>
  </div>
  )
}