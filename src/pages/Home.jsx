import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import Products from "../components/Products";
import Footer from "../components/Footer";

export default function Home({ onNavigate, onAddToCart, onSelectCategory, cartCount, searchQuery, onSearchChange, onViewProduct, theme, onToggleTheme, user, onLogout }) {
  return (
    <>
      <Navbar
        activePage="home"
        onNavigate={onNavigate}
        cartCount={cartCount}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        theme={theme}
        onToggleTheme={onToggleTheme}
        user={user}
        onLogout={onLogout}
      />
      <Hero onNavigate={onNavigate} />
      <Categories onSelectCategory={onSelectCategory} />
      <div className="home-product-section">
        <Products onAddToCart={onAddToCart} searchQuery={searchQuery} onViewProduct={onViewProduct} />
      </div>
      <Footer onNavigate={onNavigate} />
    </>
  );
}
