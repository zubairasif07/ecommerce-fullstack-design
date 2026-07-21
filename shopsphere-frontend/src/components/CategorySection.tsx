import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCategories } from "../services/api";
import type { Category } from "../types";

const CategorySection = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch {
        setError("Unable to load categories.");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const categoriesToShow = categories;

  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Top Categories</h2>
      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
      {loading ? (
        <p className="text-sm text-slate-600">Loading categories...</p>
      ) : categoriesToShow.length === 0 ? (
        <p className="text-sm text-slate-600">No categories are available yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categoriesToShow.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="rounded-xl overflow-hidden border border-slate-200 hover:shadow-lg hover:border-red-600 transition bg-white"
            >
              <div className="h-36 w-full bg-slate-100 flex items-center justify-center text-slate-500 text-sm font-semibold">
                {cat.name}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-slate-900">{cat.name}</h3>
                {cat.description && <p className="text-sm text-slate-600 mt-1">{cat.description}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default CategorySection;