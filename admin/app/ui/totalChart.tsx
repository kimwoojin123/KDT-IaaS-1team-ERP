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
    <div>
      <h2>최다 판매 상품</h2>
      <p>상품명: {mostSoldProduct.productName}</p>
      <p>판매량: {mostSoldProduct.totalQuantity}</p>
      <p>가격: {mostSoldProduct.price}</p>
    </div>
  );
}


export function ProductPreferenceChart() {
  const [productPreferences, setProductPreferences] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/topSellingProducts');

        if (!response.ok) {
          throw new Error(`물품 선호도 데이터를 가져오지 못했습니다. 상태: ${response.status}`);
        }

        const preferencesData = await response.json();
        console.log('Received data from server:', preferencesData);

        // 이미 필요한 데이터를 서버에서 받아왔으므로 중복 호출을 피하기 위해 변환만 수행
        const transformedData = preferencesData.map(({ productKey, productName, quantity }) => ({
          productKey,
          productName,
          quantity,
        }));

        setProductPreferences(transformedData);
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
        labels: productPreferences.map((item) => item.productName),
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
        // maintainAspectRatio: false,
        // cutout: '80%', // 중간에 구멍을 내도록 설정
      },
    });

    return () => {
      // Cleanup when the component unmounts
      doughnutChart.destroy();
    };
  }, [productPreferences]);

  return (
    <div>
      <h2>최근 30일 물품 선호도</h2>
      <canvas id="productPreferencesChart" width="400" height="400"></canvas>
    </div>
  );
}