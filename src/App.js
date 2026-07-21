import { useState, useEffect } from 'react';
import './App.css';
import Home from "./pages/Home";
import ProductListing from "./pages/ProductListing";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";


import { Contact, Returns, Drivers, Warranty, About, Newsroom, Investors, Careers, Favorites, MyOrders, UserAgreement, Partnership, PrivacyPolicy } from "./pages/StaticPages";
import { api, setAuthToken, getAuthToken } from './api';

function App() {
  const [page, setPage] = useState('home');
  const [cart, setCart] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [user, setUser] = useState(null);
  const [productFilter, setProductFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.body.classList.toggle('theme-light', theme === 'light');
    document.body.classList.toggle('theme-dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    const fetchUser = async () => {
      if (getAuthToken()) {
        try {
          const userData = await api.getUser();
          setUser(userData);
        } catch (e) {
          setAuthToken(null);
        }
      }
    };
    fetchUser();
  }, []);

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
    setPage('cart');
  };

  const removeFromCart = (indexToRemove) => {
    setCart((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const saveForLater = (indexToSave) => {
    const item = cart[indexToSave];
    setSavedItems((prev) => [...prev, item]);
    removeFromCart(indexToSave);
  };

  const moveToCart = (indexToMove) => {
    const item = savedItems[indexToMove];
    setCart((prev) => [...prev, item]);
    setSavedItems((prev) => prev.filter((_, index) => index !== indexToMove));
  };

  const removeFromSaved = (indexToRemove) => {
    setSavedItems((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const clearCart = () => {
    setCart([]);
  };

  const handleSelectCategory = (category) => {
    setProductFilter(category);
    setPage('products');
  };

  const handleLogin = async (email, password) => {
    try {
      const data = await api.login(email, password);
      setAuthToken(data.token);
      setUser(data.user);
      if (data.user.is_admin) {
        setPage('admin-dashboard');
      } else {
        setPage('home');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleRegister = async (name, email, password) => {
    try {
      const data = await api.register(name, email, password);
      setAuthToken(data.token);
      setUser(data.user);
      setPage('home');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (e) {
      console.error(e);
    }
    setAuthToken(null);
    setUser(null);
    setPage('home');
  };

  const handleFilterChange = (filter) => {
    setProductFilter(filter);
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setPage('product-detail');
  };

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  const commonProps = {
    onNavigate: setPage,
    cartCount: cart.length,
    searchQuery,
    onSearchChange: handleSearchChange,
    user,
    onLogout: handleLogout,
    onClearCart: clearCart
  };

  return (
    <>
      {page === 'home' && (
        <Home
          {...commonProps}
          onAddToCart={addToCart}
          onSelectCategory={handleSelectCategory}
          onViewProduct={handleViewProduct}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}
      {page === 'products' && (
        <ProductListing
          {...commonProps}
          onAddToCart={addToCart}
          activeFilter={productFilter}
          onFilterChange={handleFilterChange}
          onViewProduct={handleViewProduct}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}
      {page === 'product-detail' && (
        <ProductDetail
          {...commonProps}
          onAddToCart={addToCart}
          product={selectedProduct}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}
      {page === 'cart' && (
        <Cart
          {...commonProps}
          cartItems={cart}
          savedItems={savedItems}
          onRemoveFromCart={removeFromCart}
          onSaveForLater={saveForLater}
          onMoveToCart={moveToCart}
          onRemoveFromSaved={removeFromSaved}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}
      {page === 'checkout' && (
        <Checkout
          {...commonProps}
          cartItems={cart}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}

      {page === 'auth' && (
        <Auth
          {...commonProps}
          onLogin={handleLogin}
          onRegister={handleRegister}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}
      {page === 'contact' && <Contact {...commonProps} />}
      {page === 'returns' && <Returns {...commonProps} />}
      {page === 'drivers' && <Drivers {...commonProps} />}
      {page === 'warranty' && <Warranty {...commonProps} />}
      {page === 'about' && <About {...commonProps} />}
      {page === 'newsroom' && <Newsroom {...commonProps} />}
      {page === 'investors' && <Investors {...commonProps} />}
      {page === 'careers' && <Careers {...commonProps} />}
      {page === 'favorites' && <Favorites {...commonProps} />}
      {page === 'my-orders' && <MyOrders {...commonProps} />}
      {page === 'user-agreement' && <UserAgreement {...commonProps} />}
      {page === 'partnership' && <Partnership {...commonProps} />}
      {page === 'privacy-policy' && <PrivacyPolicy {...commonProps} />}
      {page === 'admin-dashboard' && <AdminDashboard {...commonProps} />}
    </>
  );
}

export default App;