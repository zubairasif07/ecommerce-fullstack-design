import { Link } from "react-router-dom";
import { useLocale } from "../contexts/LocaleContext";

const TopBar = () => {
  const { language, currency, setLanguage, setCurrency } = useLocale();

  const languages = ["English", "Spanish", "French", "German", "Chinese"];
  const currencies = ["USD - Dollar", "EUR - Euro", "GBP - Pound", "JPY - Yen", "INR - Rupee"];

  return (
    <header className="shadow-sm">
      <div className="bg-white text-slate-700 text-xs border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-1 flex flex-wrap items-center justify-between gap-2">
          <span className="flex-1 min-w-0 truncate">Welcome to our online store - Always free delivery</span>
          <div className="flex gap-2 flex-wrap justify-end items-center text-[11px]">
            <Link to="/track-order" className="hover:text-red-600 transition">Track Your Order</Link>
            
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none hover:border-red-600 cursor-pointer"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>

            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none hover:border-red-600 cursor-pointer"
            >
              {currencies.map((curr) => (
                <option key={curr} value={curr}>
                  {curr}
                </option>
              ))}
            </select>

            <Link to="/seller/login" className="hover:text-red-600 transition font-semibold">Sell on ShopSphere</Link>
            <Link to="/login" className="text-red-600 font-semibold hover:underline">
              Register Or Sign In
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white py-4">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <Link to="/" className="md:col-span-3 flex items-center gap-2 hover:opacity-80 transition">
            <img src="/logo.png" alt="ShopSphere" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
            <h1 className="text-xl md:text-3xl font-black leading-tight">
              <span className="text-red-600">Shop</span>
              <span className="text-black">Sphere</span>
            </h1>
          </Link>

          <div className="md:col-span-6">
            <div className="flex flex-col md:flex-row gap-2 bg-white border border-slate-300 shadow rounded-md overflow-hidden">
              <select className="px-3 border-t md:border-t-0 md:border-r border-slate-300 focus:outline-none" aria-label="Select category">
                <option>All Categories</option>
                <option>Electronics</option>
                <option>Fashion</option>
                <option>Home</option>
                <option>Beauty</option>
              </select>
              <input className="flex-1 px-3 py-2" placeholder="Search for products..." />
              <button className="bg-red-600 text-white px-4 py-2 hover:bg-red-700 transition">Search</button>
            </div>
          </div>

          <div className="md:col-span-3 flex flex-wrap justify-end md:justify-end gap-2 md:gap-4 text-sm">
            <span className="flex items-center gap-2 text-[12px] md:text-sm">📞 Hotline: +123 456 789</span>
            <span className="flex items-center gap-2 text-[12px] md:text-sm">❤️ 0</span>
            <Link to="/cart" className="flex items-center gap-2 text-[12px] md:text-sm hover:text-red-600 transition">
              🛍️ Your Cart
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;