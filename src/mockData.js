export const mockCategories = [
  { id: 1, name: 'Laptops' },
  { id: 2, name: 'Desktops' },
  { id: 3, name: 'Tablets' },
  { id: 4, name: 'Accessories' }
];

export const mockProducts = [
  {
    id: 1,
    name: 'Aero X15 Laptop',
    description: 'A lightweight 15-inch laptop with powerful performance for creators and professionals.',
    details: 'Intel i7, 16GB RAM, 512GB SSD, NVIDIA RTX 4060, 144Hz display.',
    price: 1299.99,
    oldPrice: 1499.99,
    category: 'Laptops',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviews: 248,
    stock: 14,
    tags: ['New', 'Popular']
  },
  {
    id: 2,
    name: 'Quantum Pro Desktop',
    description: 'A customizable desktop tower built for high-end gaming and content creation.',
    details: 'AMD Ryzen 9, 32GB RAM, 1TB NVMe, Radeon RX 7800 XT.',
    price: 1699.99,
    oldPrice: 1899.99,
    category: 'Desktops',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviews: 182,
    stock: 8,
    tags: ['Best Seller']
  },
  {
    id: 3,
    name: 'SlateTab 10',
    description: 'Sleek 10-inch tablet with pen support and long battery life for multitasking on the go.',
    details: '10.5-inch AMOLED display, 128GB storage, 8GB RAM, stylus-ready.',
    price: 499.99,
    oldPrice: 549.99,
    category: 'Tablets',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    reviews: 92,
    stock: 26,
    tags: ['Trending']
  },
  {
    id: 4,
    name: 'Hypercharge Wireless Mouse',
    description: 'High-precision wireless mouse with ergonomic design and programmable buttons.',
    details: '2.4GHz wireless, 16000 DPI, RGB lighting, 60-hour battery life.',
    price: 59.99,
    oldPrice: 79.99,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviews: 312,
    stock: 72,
    tags: ['New']
  },
  {
    id: 5,
    name: 'Cobalt Ultra Laptop',
    description: 'Premium laptop with ultra-fast storage and crystal-clear display for productivity.',
    details: 'Intel i5, 16GB RAM, 1TB SSD, 16-inch QHD screen.',
    price: 1099.99,
    oldPrice: 1299.99,
    category: 'Laptops',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    reviews: 150,
    stock: 21,
    tags: []
  },
  {
    id: 6,
    name: 'Desktop Craft 500',
    description: 'A compact, powerful desktop for workstations and home office setups.',
    details: 'Intel i7, 16GB RAM, 512GB SSD, integrated graphics.',
    price: 899.99,
    oldPrice: 999.99,
    category: 'Desktops',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    rating: 4.4,
    reviews: 73,
    stock: 19,
    tags: []
  },
  {
    id: 7,
    name: 'Nebula Tablet S',
    description: 'A highly portable tablet designed for entertainment, gaming, and note taking.',
    details: '11-inch Retina display, 256GB storage, 10-hour battery life.',
    price: 599.99,
    oldPrice: 699.99,
    category: 'Tablets',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
    rating: 4.3,
    reviews: 104,
    stock: 34,
    tags: []
  },
  {
    id: 8,
    name: 'PureSound Wireless Earbuds',
    description: 'Wireless earbuds with noise cancellation and premium audio tuning.',
    details: 'Bluetooth 5.3, 30-hour battery, touch controls.',
    price: 129.99,
    oldPrice: 159.99,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviews: 201,
    stock: 59,
    tags: ['Popular']
  }
];

export const mockPromotions = [
  { id: 1, code: 'SAVE10', discount_percent: 10, valid_until: null, usage_limit: null, times_used: 0 },
  { id: 2, code: 'FREESHIP', discount_percent: 15, valid_until: null, usage_limit: null, times_used: 0 }
];

export const mockUsers = [
  { id: 1, name: 'Demo User', email: 'demo@shopsphere.com', password: 'password', is_admin: false },
  { id: 2, name: 'Admin User', email: 'admin@shopsphere.com', password: 'admin123', is_admin: true }
];

export const mockSettings = {
  hero_title: 'Engineered for Performance',
  hero_subtitle: 'Discover our latest collection of premium laptops designed for professionals and creators.',
  hero_image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop',
  site_name: 'ShopSphere'
};
