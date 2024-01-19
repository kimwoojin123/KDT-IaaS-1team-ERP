'use client'

import React, { useState } from "react";
import SaleChart from "../ui/saleChart";
import { TopProductSection, ProductPreferenceChart, CategorySalesChart } from "../ui/totalChart";


export default function Chart() {
  const [selectedChart, setSelectedChart] = useState("SaleChart");

  const handleChartClick = (chartName : any) => {
    setSelectedChart(chartName);
  };

  return (
    <div className="flex flex-col w-svw opacity-0 animate-fade-in">
      <div className="flex justify-around">
        <button className="w-36 bg-gray-200 rounded-md" onClick={() => handleChartClick("SaleChart")}>총 판매량</button>
        <button className="w-36 bg-gray-200 rounded-md" onClick={() => handleChartClick("TopProductSection")}>최다 판매 상품</button>
        <button className="w-36 bg-gray-200 rounded-md" onClick={() => handleChartClick("ProductPreferenceChart")}>최상위 판매 상품(30일)</button>
        <button className="w-36 bg-gray-200 rounded-md" onClick={() => handleChartClick("CategorySalesChart")}>카테고리별 판매량(30일)</button>
      </div>
      <div className="mr-10 mt-20">
        {selectedChart === "SaleChart" && <SaleChart />}
        {selectedChart === "TopProductSection" && <TopProductSection />}
        {selectedChart === "ProductPreferenceChart" && <ProductPreferenceChart />}
        {selectedChart === "CategorySalesChart" && <CategorySalesChart />}
      </div>
    </div>
  );
}