import TopHeader from "@/app/components/header/TopHeader";
import NavBar from "@/app/components/header/NavBar";
import StatsOverview from "@/app/components/header/StatsOverview";
import StatsGrid from "@/app/components/header/StatsGrid";
import { Tab, TabGroup } from "@headlessui/react";

export default function Header() {
  return (
    <div className="bg-gray-50 flex flex-col">
      <TopHeader />
      <NavBar />
    </div>
  );
}
