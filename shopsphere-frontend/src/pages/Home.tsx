import SubNav from "../components/SubNav";
import Hero from "../components/Hero";
import CategorySection from "../components/CategorySection";
import DealsSection from "../components/DealsSection";

function Home() {
  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <SubNav />
        <Hero />
        <CategorySection />
        <DealsSection />
      </div>
    </div>
  );
}

export default Home;

