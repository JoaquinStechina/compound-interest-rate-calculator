"use client";
import { InvestmentData } from "@/types";
import { useState } from "react";

import MainChart from "./MainChart";
import MainForm from "./MainForm";

const MainPage: React.FC = () => {
  const [investmentData, setInvestmentData] = useState<InvestmentData>();
  return (
    <div className="grid grid-cols-2 py-5">
      <MainForm handleSubmit={setInvestmentData} />
      <MainChart investmentData={investmentData} />
    </div>
  );
};

export default MainPage;
