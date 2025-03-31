"use client";
import { InvestmentData } from "@/types";
import { useState } from "react";

import MainChart from "./MainChart";
import MainForm from "./MainForm";

const MainPage: React.FC = () => {
  const [investmentData, setInvestmentData] = useState<InvestmentData>();
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="border border-dashed border-1 border-t-0 border-b-0 border-l-0" />
      <MainForm handleSubmit={setInvestmentData} />
      <MainChart investmentData={investmentData} />
      <div className="border border-dashed border-1 border-t-0 border-b-0 border-r-0" />
    </div>
  );
};

export default MainPage;
