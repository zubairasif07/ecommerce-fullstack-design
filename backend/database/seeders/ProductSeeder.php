<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Category;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run()
    {
        $categories = ['Laptops', 'Desktops', 'Tablets', 'Monitors', 'Accessories', 'Photography'];
        $catMap = [];
        foreach ($categories as $cat) {
            $category = Category::firstOrCreate(['name' => $cat]);
            $catMap[$cat] = $category->id;
        }

        $products = [
            // Laptops
            [
                'name' => 'MacBook Pro 16" M3 Max',
                'description' => 'The most advanced Mac ever built for professionals. Features the M3 Max chip for extreme workflows.',
                'price' => 3499.00,
                'old_price' => 3699.00,
                'category_id' => $catMap['Laptops'],
                'image' => 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop',
                'stock' => 15,
                'rating' => 4.9,
                'reviews' => 124
            ],
            [
                'name' => 'Dell XPS 15',
                'description' => 'Stunning 4K OLED display and powerful Intel Core i9 processor packed in a slim, elegant chassis.',
                'price' => 2299.99,
                'old_price' => 2499.99,
                'category_id' => $catMap['Laptops'],
                'image' => 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1000&auto=format&fit=crop',
                'stock' => 20,
                'rating' => 4.7,
                'reviews' => 89
            ],
            [
                'name' => 'Lenovo ThinkPad X1 Carbon',
                'description' => 'The gold standard for business laptops. Ultralight design with legendary keyboard and battery life.',
                'price' => 1650.00,
                'old_price' => null,
                'category_id' => $catMap['Laptops'],
                'image' => 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1000&auto=format&fit=crop',
                'stock' => 35,
                'rating' => 4.8,
                'reviews' => 210
            ],
            [
                'name' => 'ASUS ROG Zephyrus G14',
                'description' => 'A compact gaming powerhouse featuring AMD Ryzen 9 and an NVIDIA RTX 4070.',
                'price' => 1599.99,
                'old_price' => 1799.00,
                'category_id' => $catMap['Laptops'],
                'image' => 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1000&auto=format&fit=crop',
                'stock' => 12,
                'rating' => 4.6,
                'reviews' => 67
            ],
            // Desktops
            [
                'name' => 'iMac 24-inch M3',
                'description' => 'Vibrant, incredibly thin design powered by M3. Brilliant 4.5K Retina display.',
                'price' => 1299.00,
                'old_price' => null,
                'category_id' => $catMap['Desktops'],
                'image' => 'https://images.unsplash.com/photo-1527443195645-1133f7f28990?q=80&w=1000&auto=format&fit=crop',
                'stock' => 25,
                'rating' => 4.8,
                'reviews' => 45
            ],
            [
                'name' => 'Alienware Aurora R16',
                'description' => 'Unleash ultimate gaming performance with the radically redesigned Aurora R16 desktop.',
                'price' => 2599.99,
                'old_price' => 2899.99,
                'category_id' => $catMap['Desktops'],
                'image' => 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=1000&auto=format&fit=crop',
                'stock' => 8,
                'rating' => 4.5,
                'reviews' => 32
            ],
            [
                'name' => 'HP Envy All-in-One 34',
                'description' => 'Create seamlessly on a massive 34-inch WUHD display with a detachable magnetic camera.',
                'price' => 1899.00,
                'old_price' => 2100.00,
                'category_id' => $catMap['Desktops'],
                'image' => 'https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=1000&auto=format&fit=crop',
                'stock' => 14,
                'rating' => 4.7,
                'reviews' => 54
            ],
            // Tablets
            [
                'name' => 'iPad Pro 12.9" M2',
                'description' => 'The ultimate iPad experience with the most advanced display and blazing-fast M2 chip.',
                'price' => 1099.00,
                'old_price' => null,
                'category_id' => $catMap['Tablets'],
                'image' => 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1000&auto=format&fit=crop',
                'stock' => 40,
                'rating' => 4.9,
                'reviews' => 312
            ],
            [
                'name' => 'Samsung Galaxy Tab S9 Ultra',
                'description' => 'A massive 14.6-inch Dynamic AMOLED 2X display and S Pen included for endless creativity.',
                'price' => 1199.99,
                'old_price' => 1299.99,
                'category_id' => $catMap['Tablets'],
                'image' => 'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?q=80&w=1000&auto=format&fit=crop',
                'stock' => 18,
                'rating' => 4.8,
                'reviews' => 120
            ],
            [
                'name' => 'Microsoft Surface Pro 9',
                'description' => 'Laptop power and tablet flexibility. The perfect 2-in-1 device for everyday use.',
                'price' => 999.00,
                'old_price' => 1100.00,
                'category_id' => $catMap['Tablets'],
                'image' => 'https://images.unsplash.com/photo-1594806059632-4161fdf063e6?q=80&w=1000&auto=format&fit=crop',
                'stock' => 22,
                'rating' => 4.6,
                'reviews' => 88
            ],
            // Monitors
            [
                'name' => 'LG UltraGear 27" OLED Gaming Monitor',
                'description' => 'Experience next-level gaming with an OLED panel, 240Hz refresh rate, and 0.03ms response time.',
                'price' => 899.99,
                'old_price' => 999.99,
                'category_id' => $catMap['Monitors'],
                'image' => 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=1000&auto=format&fit=crop',
                'stock' => 30,
                'rating' => 4.8,
                'reviews' => 150
            ],
            [
                'name' => 'Dell UltraSharp 32 4K USB-C Hub Monitor',
                'description' => 'Exceptional color accuracy and clarity. Designed for creative professionals and multitasking.',
                'price' => 750.00,
                'old_price' => null,
                'category_id' => $catMap['Monitors'],
                'image' => 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=1000&auto=format&fit=crop',
                'stock' => 15,
                'rating' => 4.7,
                'reviews' => 64
            ],
            [
                'name' => 'Samsung 49" Odyssey OLED G9',
                'description' => 'Immersive ultra-wide 32:9 curved OLED monitor that surrounds your field of vision.',
                'price' => 1599.99,
                'old_price' => 1799.99,
                'category_id' => $catMap['Monitors'],
                'image' => 'https://images.unsplash.com/photo-1552831388-6a0b3575b32a?q=80&w=1000&auto=format&fit=crop',
                'stock' => 5,
                'rating' => 4.9,
                'reviews' => 110
            ],
            // Accessories
            [
                'name' => 'Logitech MX Master 3S',
                'description' => 'The ultimate precision mouse. Features quiet clicks, 8K DPI sensor, and ergonomic design.',
                'price' => 99.99,
                'old_price' => null,
                'category_id' => $catMap['Accessories'],
                'image' => 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?q=80&w=1000&auto=format&fit=crop',
                'stock' => 100,
                'rating' => 4.9,
                'reviews' => 520
            ],
            [
                'name' => 'Keychron Q1 Pro Wireless Mechanical Keyboard',
                'description' => 'A fully customizable 75% layout mechanical keyboard with Bluetooth and QMK/VIA support.',
                'price' => 199.00,
                'old_price' => null,
                'category_id' => $catMap['Accessories'],
                'image' => 'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=1000&auto=format&fit=crop',
                'stock' => 45,
                'rating' => 4.8,
                'reviews' => 180
            ],
            [
                'name' => 'Sony WH-1000XM5 Noise Canceling Headphones',
                'description' => 'Industry-leading noise cancellation and incredible audio quality for distraction-free listening.',
                'price' => 398.00,
                'old_price' => null,
                'category_id' => $catMap['Accessories'],
                'image' => 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1000&auto=format&fit=crop',
                'stock' => 60,
                'rating' => 4.8,
                'reviews' => 450
            ],
            [
                'name' => 'Anker 737 Power Bank (PowerCore 24K)',
                'description' => 'Massive 24,000mAh capacity with 140W fast charging. Enough to charge a laptop on the go.',
                'price' => 149.99,
                'old_price' => 179.99,
                'category_id' => $catMap['Accessories'],
                'image' => 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?q=80&w=1000&auto=format&fit=crop',
                'stock' => 80,
                'rating' => 4.7,
                'reviews' => 205
            ],
            // Photography
            [
                'name' => 'Sony Alpha a7 IV Mirrorless Camera',
                'description' => 'A true hybrid with 33MP sensor, incredible autofocus, and outstanding 4K video capabilities.',
                'price' => 2498.00,
                'old_price' => null,
                'category_id' => $catMap['Photography'],
                'image' => 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop',
                'stock' => 10,
                'rating' => 4.9,
                'reviews' => 87
            ],
            [
                'name' => 'Canon EOS R6 Mark II',
                'description' => 'Capture fast action with up to 40 fps shooting and exceptional low-light performance.',
                'price' => 2499.00,
                'old_price' => null,
                'category_id' => $catMap['Photography'],
                'image' => 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=1000&auto=format&fit=crop',
                'stock' => 15,
                'rating' => 4.8,
                'reviews' => 65
            ],
            [
                'name' => 'DJI Mini 4 Pro Drone',
                'description' => 'Lightweight, foldable drone with omnidirectional obstacle sensing and 4K/60fps HDR video.',
                'price' => 959.00,
                'old_price' => null,
                'category_id' => $catMap['Photography'],
                'image' => 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1000&auto=format&fit=crop',
                'stock' => 25,
                'rating' => 4.9,
                'reviews' => 142
            ]
        ];

        foreach ($products as $p) {
            Product::create($p);
        }
    }
}
