// src/components/Navbar.tsx
const Navbar = () => {
  return (
    <div className="bg-[#131921] text-white px-6 py-3 flex items-center justify-between">
      
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="ShopSphere" className="w-10 h-10 object-contain" />
        <h1 className="text-2xl font-bold"><span className="text-red-600">Shop</span><span className="text-white">Sphere</span></h1>
      </div>

      {/* Search */}
      <div className="flex w-1/2">
        <select className="bg-gray-200 text-black px-2" title="Product category" aria-label="Product category">
          <option>All</option>
        </select>
        <input
          className="w-full px-3 py-2 text-black"
          placeholder="Search products..."
        />
        <button className="bg-yellow-400 px-4">🔍</button>
      </div>

      {/* Right */}
      <div className="flex gap-6 text-sm">
        <div>
          <p>Hello, Sign in</p>
          <p className="font-bold">Account</p>
        </div>
        <div>
          <p>Returns</p>
          <p className="font-bold">& Orders</p>
        </div>
        <div className="font-bold">Cart 🛒</div>
      </div>
    </div>
  );
};

export default Navbar;