"use client";
import { InvestmentDataObject } from "@/types";
import { useState } from "react";

import MainChart from "./MainChart";
import MainForm from "./MainForm";

const MainPage: React.FC = () => {
  const [investmentDataObject, setInvestmentDataObject] =
    useState<InvestmentDataObject>();
  return (
    <div className="grid grid-cols-2">
      <MainForm handleSubmit={setInvestmentDataObject} />
      <MainChart />
    </div>
  );
};

export default MainPage;
