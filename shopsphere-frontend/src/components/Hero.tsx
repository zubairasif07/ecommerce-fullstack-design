import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCategories } from '../services/api';
import type { Category } from '../types';
import heroImage from '../assets/hero.png';

const Hero = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const promos = categories.slice(0, 3).map((category, index) => ({
    label: category.name,
    subtitle: `Shop ${category.name}`,
    color: ['bg-red-500', 'bg-blue-600', 'bg-rose-500'][index % 3],
    link: `/category/${category.slug}`,
  }));

  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <Link
          to={categories[0] ? `/category/${categories[0].slug}` : '/products'}
          className="lg:col-span-8 relative rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition"
        >
          <img
            src={heroImage}
            alt="Main promo"
            className="w-full h-[420px] object-cover hover:scale-105 transition"
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 p-6 flex flex-col justify-center text-white">
            <p className="text-sm uppercase tracking-wider bg-red-600 inline-block px-3 py-1 rounded w-fit">Extra 25% Off</p>
            <h2 className="text-3xl md:text-5xl font-black mt-3">Discover products from real sellers</h2>
            <p className="mt-2 text-base md:text-lg max-w-xl">Browse live inventory, place orders, and see real products backed by the Shopsphere database.</p>
            <button className="mt-5 inline-flex items-center gap-2 bg-white text-black font-bold uppercase px-5 py-2 rounded-lg hover:bg-gray-100 transition">
              Shop Now
            </button>
          </div>
        </Link>

        <div className="lg:col-span-4 grid grid-cols-1 gap-4">
          {loading ? (
            <div className="rounded-xl bg-slate-100 p-6 text-slate-700">Loading categories...</div>
          ) : promos.length === 0 ? (
            <div className="rounded-xl bg-slate-100 p-6 text-slate-700">No featured categories available</div>
          ) : (
            promos.map((promo, idx) => (
              <Link
                key={idx}
                to={promo.link}
                className={`${promo.color} text-white rounded-xl p-4 md:p-6 flex flex-col justify-between hover:shadow-lg hover:scale-105 transition`}
              >
                <div>
                  <p className="text-2xl md:text-3xl font-bold">{promo.label}</p>
                  <p className="text-xs md:text-sm opacity-90 mt-1">{promo.subtitle}</p>
                </div>
                <button className="mt-4 border border-white py-2 px-4 rounded text-sm font-semibold uppercase hover:bg-white hover:text-current transition">
                  Shop Now
                </button>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;