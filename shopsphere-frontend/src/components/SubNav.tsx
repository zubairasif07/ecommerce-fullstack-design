import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCategories } from "../services/api";
import type { Category } from "../types";

const SubNav = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch {
        setCategories([]);
      }
    };

    loadCategories();
  }, []);

  return (
    <nav className="bg-black text-white text-sm">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap gap-2">
        {['WEEKLY FEATURED', 'HOT SALE ITEMS', 'TOP NEW ITEMS', 'TOP SELLING', 'TOP RATED ITEMS'].map((item, index) => (
          <span key={index} className="px-2 py-1 rounded bg-red-600/95">{item}</span>
        ))}
      </div>
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-2 grid grid-cols-2 md:grid-cols-8 gap-2 text-xs md:text-sm">
          {categories.length === 0 ? (
            <span className="px-2 py-1 rounded bg-slate-700/90">Loading categories...</span>
          ) : (
            categories.slice(0, 8).map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="rounded bg-slate-900 hover:bg-red-600 px-2 py-1 text-left md:text-center transition"
              >
                {cat.name}
              </Link>
            ))
          )}
        </div>
      </div>
    </nav>
  );
};

export default SubNav;