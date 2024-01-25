'use client'

// 'use client' 주석 추가
import React, { useState } from "react";
import SaleChart from "../ui/saleChart";
import { TopProductSection, ProductPreferenceChart, CategorySalesChart } from "../ui/totalChart";

export default function Chart() {
  // 선택된 차트를 상태로 관리
  const [selectedChart, setSelectedChart] = useState("SaleChart");

  // 차트 클릭 시 호출되는 핸들러
  const handleChartClick = (chartName: any) => {
    setSelectedChart(chartName);
  };

  // JSX 반환
  return (
    <div className="flex flex-col w-screen opacity-0 animate-fade-in">
      {/* 차트 선택 버튼 그룹 */}
      <div className="flex justify-around">
        <button className="w-36 bg-gray-200 rounded-md" onClick={() => handleChartClick("SaleChart")}>
          총 판매량
        </button>
        <button className="w-36 bg-gray-200 rounded-md" onClick={() => handleChartClick("TopProductSection")}>
          최다 판매 상품
        </button>
        <button className="w-36 bg-gray-200 rounded-md" onClick={() => handleChartClick("ProductPreferenceChart")}>
          최상위 판매 상품(30일)
        </button>
        <button className="w-36 bg-gray-200 rounded-md" onClick={() => handleChartClick("CategorySalesChart")}>
          카테고리별 판매량(30일)
        </button>
      </div>

      {/* 선택된 차트에 따라 해당 컴포넌트 렌더링 */}
      <div className="mr-10 mt-20">
        <div className="flex justify-center">
          {selectedChart === "SaleChart" && <SaleChart />}
        </div>
        {selectedChart === "TopProductSection" && <TopProductSection />}
        <div className="flex justify-center">
          {selectedChart === "ProductPreferenceChart" && <ProductPreferenceChart />}
        </div>
        <div className="flex justify-center">
          {selectedChart === "CategorySalesChart" && <CategorySalesChart />}
        </div>
      </div>
    </div>
  );
}
