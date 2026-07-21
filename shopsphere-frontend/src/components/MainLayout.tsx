import { ReactNode } from "react";
import TopBar from "./TopBar";
import SubNav from "./SubNav";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto">
        <TopBar />
        <SubNav />
      </div>
      {children}
    </div>
  );
};

export default MainLayout;
