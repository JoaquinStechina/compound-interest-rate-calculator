import MainChart from "@/components/mainPage/MainChart";
import MainForm from "@/components/mainPage/MainForm";

export default function Home() {
  return (
    <div className="grid grid-cols-2">
      <MainForm />
      <MainChart />
    </div>
  );
}
