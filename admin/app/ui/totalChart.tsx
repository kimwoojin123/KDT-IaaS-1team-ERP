'use client'
import { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';


export function TopProductSection() {
  const [mostSoldProduct, setMostSoldProduct] = useState({ productKey: 0, totalQuantity: 0, productName: '', price: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/mostSoldProduct');

        if (!response.ok) {
          throw new Error(`최다 판매 상품 데이터를 가져오지 못했습니다. 상태: ${response.status}`);
        }

        const mostSoldProductData = await response.json();
        setMostSoldProduct(mostSoldProductData);
      } catch (error) {
        console.error('최다 판매 상품 데이터를 가져오는 중 오류 발생:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='h-96 flex flex-col items-center justify-center'>
      <h2 className='font-bold text-4xl mb-10'>최다 판매 상품</h2>
      <div className='w-72 h-80 border-gray-300 border rounded-md'>
      <img src="/trophy.png" width={300} height={300}/>
      <div className='h-32 flex flex-col justify-center items-center'>
      <p>상품명: {mostSoldProduct.productName}</p>
      <p>판매량: {mostSoldProduct.totalQuantity}</p>
      <p>가격: {mostSoldProduct.price}</p>
      </div>
      </div>
    </div>
  );
}



export function ProductPreferenceChart() {
  const [productPreferences, setProductPreferences] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/order/productPreferences');

        if (!response.ok) {
          throw new Error(`물품 선호도 데이터를 가져오지 못했습니다. 상태: ${response.status}`);
        }

        const preferencesData = await response.json();
        setProductPreferences(preferencesData);
      } catch (error) {
        console.error("물품 선호도 데이터를 가져오는 중 오류 발생:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Canvas 요소 가져오기
    const ctx = document.getElementById('productPreferencesChart') as HTMLCanvasElement;

    // 주문 통계를 나타내는 도넛츠 차트 생성
    const doughnutChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: productPreferences.map((item) => item.name),
        datasets: [{
          data: productPreferences.map((item) => item.quantity),
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
          ],
          borderWidth: 1,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    return () => {
      // Cleanup when the component unmounts
      doughnutChart.destroy();
    };
  }, [productPreferences]);

  return (
    <div className='h-96 flex flex-col items-center justify-center'>
      <h2 className='font-bold text-4xl mb-10'>상품 선호도(30일)</h2>
      <canvas id="productPreferencesChart" width="100%" height="100%"></canvas>
    </div>
  );
}





export function CategorySalesChart() {
  const [categorySales, setCategorySales] = useState<CategorySale[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/categorySales');

        if (!response.ok) {
          throw new Error(`카테고리별 판매량 데이터를 가져오지 못했습니다. 상태: ${response.status}`);
        }

        const salesData = await response.json();
        console.log('Received category sales data from server:', salesData);

        setCategorySales(salesData);
      } catch (error) {
        console.error("카테고리별 판매량 데이터를 가져오는 중 오류 발생:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const ctx = document.getElementById('categorySalesChart') as HTMLCanvasElement;

    const barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: categorySales.map((item) => item.cateName),
        datasets: [{
          label: '판매량',
          data: categorySales.map((item) => item.totalSales),
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      barChart.destroy();
    };
  }, [categorySales]);

  return (
    <div className='h-96 flex flex-col items-center'>
      <h3 className='font-bold text-4xl mb-10'>분류별 판매량(30일)</h3>
      <canvas id="categorySalesChart" width="100%" height="100%"></canvas>
    </div>
  );
}
