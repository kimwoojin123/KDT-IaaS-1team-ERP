'use client'
import { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

<<<<<<< HEAD
interface MostSoldProduct {
  productKey: number;
  totalQuantity: number;
  productName: string;
  price: number;
}

interface ProductPreference {
  productKey: number;
  productName: string;
  quantity: number;
}

interface CategorySale {
  cateName: string;
  totalSales: number;
}


export function TopProductSection() {
  const [mostSoldProduct, setMostSoldProduct] = useState<MostSoldProduct>({ 
    productKey: 0, 
    totalQuantity: 0, 
    productName: '', 
    price: 0 
  });
=======

export function TopProductSection() {
  const [mostSoldProduct, setMostSoldProduct] = useState({ productKey: 0, totalQuantity: 0, productName: '', price: 0 });
>>>>>>> origin/work2

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
<<<<<<< HEAD
    <div className='h-48 flex flex-col items-center justify-center'>
=======
    <div>
>>>>>>> origin/work2
      <h2>최다 판매 상품</h2>
      <p>상품명: {mostSoldProduct.productName}</p>
      <p>판매량: {mostSoldProduct.totalQuantity}</p>
      <p>가격: {mostSoldProduct.price}</p>
    </div>
  );
}


<<<<<<< HEAD
export function ProductPreferenceChart() {
  const [productPreferences, setProductPreferences] = useState<ProductPreference[]>([]);
=======

export function ProductPreferenceChart() {
  const [productPreferences, setProductPreferences] = useState([]);
>>>>>>> origin/work2

  useEffect(() => {
    const fetchData = async () => {
      try {
<<<<<<< HEAD
        const response = await fetch('/topSellingProducts');
=======
        const response = await fetch('/order/productPreferences');
>>>>>>> origin/work2

        if (!response.ok) {
          throw new Error(`물품 선호도 데이터를 가져오지 못했습니다. 상태: ${response.status}`);
        }

<<<<<<< HEAD
        const preferencesData: { productKey: number; productName: string; quantity: number }[]  = await response.json();
        console.log('Received data from server:', preferencesData);


        // 이미 필요한 데이터를 서버에서 받아왔으므로 중복 호출을 피하기 위해 변환만 수행
        const transformedData: ProductPreference[] = preferencesData.map(({ productKey, productName, quantity }) => ({
          productKey,
          productName,
          quantity,
        }));

        setProductPreferences(transformedData);
=======
        const preferencesData = await response.json();
        setProductPreferences(preferencesData);
>>>>>>> origin/work2
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
<<<<<<< HEAD
        labels: productPreferences.map((item) => item.productName),
=======
        labels: productPreferences.map((item) => item.name),
>>>>>>> origin/work2
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
<<<<<<< HEAD
        plugins: {
          legend: {
            display: true,
            labels: {
              boxWidth: 12,
              font: {
                size: 12, // 레이블 폰트 크기
              },
            },
          },
          tooltip: {
            enabled: true,
            padding: 10, // 툴팁 패딩 크기
            caretPadding: 5, // 툴팁 삼각형(padding)
            displayColors: false, // 툴팁 색상 표시 여부
            titleFont: {
              size: 10, // 툴팁 제목 폰트 크기
            },
            bodyFont: {
              size: 10, // 툴팁 내용 폰트 크기
            },
          },
        },
=======
        maintainAspectRatio: false,
>>>>>>> origin/work2
      },
    });

    return () => {
      // Cleanup when the component unmounts
      doughnutChart.destroy();
    };
  }, [productPreferences]);

  return (
<<<<<<< HEAD
    <div className='h-48 w-40 flex flex-col items-center justify-center border-r border-l'>
      <h2>상품 선호도(30일)</h2>
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
    <div className='h-48 w-40 flex flex-col justify-center'>
      <h3>분류별 판매량(30일)</h3>
      <canvas id="categorySalesChart" width="100%" height="100%"></canvas>
    </div>
  );
}
=======
    <div>
      <h2>최근 30일 물품 선호도</h2>
      <canvas id="productPreferencesChart" width="400" height="400"></canvas>
    </div>
  );
};
>>>>>>> origin/work2
