'use client'
import { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns'; // 어댑터 추가


interface SalesDataItem {
  date: string;
  quantity: string;
  // 다른 속성이 있다면 추가할 수 있습니다.
}



export default function SaleChart() {
  const [salesData, setSalesData] = useState<SalesDataItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/order/salesData');

        if (!response.ok) {
          throw new Error(`판매 데이터를 가져오지 못했습니다. 상태: ${response.status}`);
        }

        const salesData = await response.json();
        setSalesData(salesData);
      } catch (error) {
        console.error("판매 데이터를 가져오는 중 오류 발생:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Canvas 요소 가져오기
    const ctx = document.getElementById('salesChart') as HTMLCanvasElement;;

    // 기존에 생성된 Chart가 있다면 파괴
    if (ctx) {
      const existingChart = Chart.getChart(ctx);
      if (existingChart) {
        existingChart.destroy();
      }
    }

      // 일주일 전 날짜 계산
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);

      // 필터된 데이터 가져오기
      const filteredData = salesData.filter(item => new Date(item.date) >= lastWeek);



      const stackedData: { [date: string]: number } = {};
      filteredData.forEach(item => {
        const date = item.date;
    
        if (String(item.quantity).includes(',')) {
          const quantities = String(item.quantity).split(',').map(Number);
          const totalQuantity = quantities.reduce((acc, curr) => acc + curr, 0);
    
          // 같은 날짜의 데이터가 이미 있다면 더하기
          stackedData[date] = (stackedData[date] || 0) + totalQuantity;
        } else {
          // 같은 날짜의 데이터가 이미 있다면 더하기
          stackedData[date] = (stackedData[date] || 0) + Number(item.quantity);
        }
      });
    
      // 그래프를 그릴 데이터
      const data = {
        labels: Object.keys(stackedData),
        datasets: [
          {
            label: "총 판매량",
            data: Object.values(stackedData),
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      };

    // 그래프를 그릴 옵션
    const options = {
      scales: {
        x: {
          type: 'time', // x 축의 타입을 시간으로 설정
          time: {
            unit: 'day', // 일자 단위로 표시
            tooltipFormat: 'yyyy-MM-dd'
          },
          stacked:true,
        },
        y: {
          beginAtZero: true,
          stacked: true,
        },
      },
    };

    // 주문 통계를 나타내는 그래프 생성
    new Chart(ctx, {
      type: 'bar', // 막대 그래프
      data: data,
      options: options as any,
    });
  }, [salesData]); // useEffect를 salesData가 변경될 때마다 실행되도록 설정

  return (
    <div className='h-96 flex flex-col items-center'>
      <p className='font-bold text-4xl mb-10'>총 판매량</p>
      <canvas id="salesChart" width="100%" height="100%"></canvas>
    </div>
  );
};