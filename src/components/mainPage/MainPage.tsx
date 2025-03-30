import { useState } from "react";

import MainChart from "./MainChart";
import MainForm from "./MainForm";

const MainPage: React.FC = () => {
  const [moneyArray, setMoneyArray] = useState<[] | null>([]);

  return (
    <div>
      <MainForm />
      <MainChart />
    </div>
  );
};

export default MainPage;
