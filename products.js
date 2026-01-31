// Product Database
const products = {
    processors: [
        {
            id: 'cpu-001',
            name: 'Intel Core i9-13900K',
            description: '24-core (8P+16E) processor, 5.8 GHz max turbo frequency, 36MB cache',
            price: 599.99,
            originalPrice: 649.99,
            image: 'https://via.placeholder.com/300x300/007bff/ffffff?text=Intel+i9-13900K',
            category: 'processors',
            brand: 'Intel',
            specs: {
                cores: '24 (8P+16E)',
                baseClock: '3.0 GHz',
                maxClock: '5.8 GHz',
                cache: '36MB Smart Cache',
                tdp: '125W',
                socket: 'LGA1700'
            },
            rating: 4.8,
            reviews: 234,
            inStock: true,
            badge: 'hot'
        },
        {
            id: 'cpu-002',
            name: 'AMD Ryzen 9 7950X',
            description: '16-core processor, 5.7 GHz max boost, 80MB cache, AM5 socket',
            price: 549.99,
            originalPrice: 599.99,
            image: 'https://via.placeholder.com/300x300/dc3545/ffffff?text=AMD+Ryzen+9+7950X',
            category: 'processors',
            brand: 'AMD',
            specs: {
                cores: '16',
                baseClock: '4.5 GHz',
                maxClock: '5.7 GHz',
                cache: '80MB L3 Cache',
                tdp: '170W',
                socket: 'AM5'
            },
            rating: 4.9,
            reviews: 189,
            inStock: true,
            badge: 'sale'
        },
        {
            id: 'cpu-003',
            name: 'Intel Core i7-13700K',
            description: '16-core (8P+8E) processor, 5.4 GHz max turbo, 30MB cache',
            price: 399.99,
            image: 'https://via.placeholder.com/300x300/007bff/ffffff?text=Intel+i7-13700K',
            category: 'processors',
            brand: 'Intel',
            specs: {
                cores: '16 (8P+8E)',
                baseClock: '3.4 GHz',
                maxClock: '5.4 GHz',
                cache: '30MB Smart Cache',
                tdp: '125W',
                socket: 'LGA1700'
            },
            rating: 4.7,
            reviews: 312,
            inStock: true,
            badge: 'new'
        },
        {
            id: 'cpu-004',
            name: 'AMD Ryzen 7 7700X',
            description: '8-core processor, 5.4 GHz max boost, 40MB cache',
            price: 349.99,
            image: 'https://via.placeholder.com/300x300/dc3545/ffffff?text=AMD+Ryzen+7+7700X',
            category: 'processors',
            brand: 'AMD',
            specs: {
                cores: '8',
                baseClock: '4.2 GHz',
                maxClock: '5.4 GHz',
                cache: '40MB L3 Cache',
                tdp: '105W',
                socket: 'AM5'
            },
            rating: 4.6,
            reviews: 156,
            inStock: true
        }
    ],
    'graphics-cards': [
        {
            id: 'gpu-001',
            name: 'NVIDIA GeForce RTX 4090',
            description: '24GB GDDR6X VRAM, 16,384 CUDA cores, 2.52 GHz boost clock',
            price: 1599.99,
            originalPrice: 1799.99,
            image: 'https://via.placeholder.com/300x300/76b900/ffffff?text=NVIDIA+RTX+4090',
            category: 'graphics-cards',
            brand: 'NVIDIA',
            specs: {
                memory: '24GB GDDR6X',
                cudaCores: '16,384',
                boostClock: '2.52 GHz',
                memoryClock: '21 Gbps',
                power: '450W',
                interface: 'PCIe 4.0'
            },
            rating: 4.9,
            reviews: 421,
            inStock: true,
            badge: 'hot'
        },
        {
            id: 'gpu-002',
            name: 'AMD Radeon RX 7900 XTX',
            description: '24GB GDDR6 VRAM, 6,144 stream processors, 2.5 GHz game clock',
            price: 999.99,
            originalPrice: 1099.99,
            image: 'https://via.placeholder.com/300x300/dc3545/ffffff?text=AMD+RX+7900+XTX',
            category: 'graphics-cards',
            brand: 'AMD',
            specs: {
                memory: '24GB GDDR6',
                streamProcessors: '6,144',
                gameClock: '2.5 GHz',
                memoryClock: '20 Gbps',
                power: '355W',
                interface: 'PCIe 4.0'
            },
            rating: 4.7,
            reviews: 287,
            inStock: true,
            badge: 'sale'
        },
        {
            id: 'gpu-003',
            name: 'NVIDIA GeForce RTX 4070 Ti',
            description: '12GB GDDR6X VRAM, 7,680 CUDA cores, 2.61 GHz boost clock',
            price: 799.99,
            image: 'https://via.placeholder.com/300x300/76b900/ffffff?text=NVIDIA+RTX+4070+Ti',
            category: 'graphics-cards',
            brand: 'NVIDIA',
            specs: {
                memory: '12GB GDDR6X',
                cudaCores: '7,680',
                boostClock: '2.61 GHz',
                memoryClock: '21 Gbps',
                power: '285W',
                interface: 'PCIe 4.0'
            },
            rating: 4.8,
            reviews: 198,
            inStock: true,
            badge: 'new'
        }
    ],
    memory: [
        {
            id: 'mem-001',
            name: 'Corsair Dominator Platinum RGB 32GB DDR5-6000',
            description: '32GB (2x16GB) DDR5-6000 CL30, RGB lighting, black heatsink',
            price: 249.99,
            originalPrice: 279.99,
            image: 'https://via.placeholder.com/300x300/000000/ffffff?text=Corsair+DDR5-6000',
            category: 'memory',
            brand: 'Corsair',
            specs: {
                capacity: '32GB (2x16GB)',
                type: 'DDR5',
                speed: '6000MHz',
                latency: 'CL30',
                voltage: '1.35V',
                modules: '2'
            },
            rating: 4.8,
            reviews: 167,
            inStock: true,
            badge: 'sale'
        },
        {
            id: 'mem-002',
            name: 'G.Skill Trident Z5 RGB 32GB DDR5-5600',
            description: '32GB (2x16GB) DDR5-5600 CL36, RGB lighting, silver heatsink',
            price: 199.99,
            image: 'https://via.placeholder.com/300x300/6c757d/ffffff?text=G.Skill+DDR5-5600',
            category: 'memory',
            brand: 'G.Skill',
            specs: {
                capacity: '32GB (2x16GB)',
                type: 'DDR5',
                speed: '5600MHz',
                latency: 'CL36',
                voltage: '1.25V',
                modules: '2'
            },
            rating: 4.7,
            reviews: 134,
            inStock: true
        },
        {
            id: 'mem-003',
            name: 'Corsair Vengeance RGB Pro 32GB DDR4-3600',
            description: '32GB (2x16GB) DDR4-3600 CL18, RGB lighting, black heatsink',
            price: 149.99,
            image: 'https://via.placeholder.com/300x300/000000/ffffff?text=Corsair+DDR4-3600',
            category: 'memory',
            brand: 'Corsair',
            specs: {
                capacity: '32GB (2x16GB)',
                type: 'DDR4',
                speed: '3600MHz',
                latency: 'CL18',
                voltage: '1.35V',
                modules: '2'
            },
            rating: 4.6,
            reviews: 289,
            inStock: true
        }
    ],
    storage: [
        {
            id: 'sto-001',
            name: 'Samsung 980 PRO 2TB NVMe SSD',
            description: '2TB NVMe M.2 SSD, 7,000 MB/s read, 5,000 MB/s write',
            price: 189.99,
            originalPrice: 219.99,
            image: 'https://via.placeholder.com/300x300/1e40af/ffffff?text=Samsung+980+PRO+2TB',
            category: 'storage',
            brand: 'Samsung',
            specs: {
                capacity: '2TB',
                interface: 'NVMe PCIe 4.0',
                formFactor: 'M.2 2280',
                readSpeed: '7,000 MB/s',
                writeSpeed: '5,000 MB/s',
                endurance: '1200 TBW'
            },
            rating: 4.9,
            reviews: 456,
            inStock: true,
            badge: 'hot'
        },
        {
            id: 'sto-002',
            name: 'WD Black SN850X 1TB NVMe SSD',
            description: '1TB NVMe M.2 SSD, 7,300 MB/s read, 6,600 MB/s write',
            price: 129.99,
            image: 'https://via.placeholder.com/300x300/000000/ffffff?text=WD+SN850X+1TB',
            category: 'storage',
            brand: 'Western Digital',
            specs: {
                capacity: '1TB',
                interface: 'NVMe PCIe 4.0',
                formFactor: 'M.2 2280',
                readSpeed: '7,300 MB/s',
                writeSpeed: '6,600 MB/s',
                endurance: '600 TBW'
            },
            rating: 4.8,
            reviews: 324,
            inStock: true
        },
        {
            id: 'sto-003',
            name: 'Seagate FireCuda 530 4TB NVMe SSD',
            description: '4TB NVMe M.2 SSD, 7,300 MB/s read, 6,900 MB/s write',
            price: 449.99,
            image: 'https://via.placeholder.com/300x300/dc3545/ffffff?text=Seagate+530+4TB',
            category: 'storage',
            brand: 'Seagate',
            specs: {
                capacity: '4TB',
                interface: 'NVMe PCIe 4.0',
                formFactor: 'M.2 2280',
                readSpeed: '7,300 MB/s',
                writeSpeed: '6,900 MB/s',
                endurance: '2800 TBW'
            },
            rating: 4.7,
            reviews: 178,
            inStock: true,
            badge: 'new'
        }
    ],
    motherboards: [
        {
            id: 'mob-001',
            name: 'ASUS ROG Strix Z790-E Gaming WiFi',
            description: 'Intel LGA1700, DDR5 support, PCIe 5.0, WiFi 6E, Thunderbolt 4',
            price: 549.99,
            originalPrice: 599.99,
            image: 'https://via.placeholder.com/300x300/6c757d/ffffff?text=ASUS+ROG+Z790-E',
            category: 'motherboards',
            brand: 'ASUS',
            specs: {
                socket: 'LGA1700',
                chipset: 'Z790',
                memory: 'DDR5',
                memorySlots: '4',
                maxMemory: '128GB',
                formFactor: 'ATX'
            },
            rating: 4.8,
            reviews: 234,
            inStock: true,
            badge: 'sale'
        },
        {
            id: 'mob-002',
            name: 'MSI MAG X670E Tomahawk WiFi',
            description: 'AMD AM5, DDR5 support, PCIe 5.0, WiFi 6E, M.2 heatsinks',
            price: 449.99,
            image: 'https://via.placeholder.com/300x300/dc3545/ffffff?text=MSI+X670E+Tomahawk',
            category: 'motherboards',
            brand: 'MSI',
            specs: {
                socket: 'AM5',
                chipset: 'X670E',
                memory: 'DDR5',
                memorySlots: '4',
                maxMemory: '128GB',
                formFactor: 'ATX'
            },
            rating: 4.7,
            reviews: 189,
            inStock: true
        }
    ],
    'power-supplies': [
        {
            id: 'psu-001',
            name: 'Corsair RM1000x 1000W 80+ Gold',
            description: '1000W fully modular, 80+ Gold certified, 135mm fan, 10-year warranty',
            price: 189.99,
            originalPrice: 209.99,
            image: 'https://via.placeholder.com/300x300/000000/ffffff?text=Corsair+RM1000x',
            category: 'power-supplies',
            brand: 'Corsair',
            specs: {
                wattage: '1000W',
                efficiency: '80+ Gold',
                modular: 'Full',
                fanSize: '135mm',
                warranty: '10 Years'
            },
            rating: 4.8,
            reviews: 312,
            inStock: true,
            badge: 'sale'
        },
        {
            id: 'psu-002',
            name: 'Seasonic PRIME TX-1000 1000W 80+ Titanium',
            description: '1000W fully modular, 80+ Titanium certified, 135mm fan, 12-year warranty',
            price: 299.99,
            image: 'https://via.placeholder.com/300x300/6c757d/ffffff?text=Seasonic+TX-1000',
            category: 'power-supplies',
            brand: 'Seasonic',
            specs: {
                wattage: '1000W',
                efficiency: '80+ Titanium',
                modular: 'Full',
                fanSize: '135mm',
                warranty: '12 Years'
            },
            rating: 4.9,
            reviews: 156,
            inStock: true,
            badge: 'hot'
        }
    ],
    cooling: [
        {
            id: 'cool-001',
            name: 'Noctua NH-D15 Chromax Black',
            description: 'Dual tower CPU cooler, 2x 140mm fans, 6 heatpipes, premium quality',
            price: 99.99,
            originalPrice: 119.99,
            image: 'https://via.placeholder.com/300x300/6c757d/ffffff?text=Noctua+NH-D15',
            category: 'cooling',
            brand: 'Noctua',
            specs: {
                type: 'Air Cooler',
                fanSize: '2x 140mm',
                height: '165mm',
                noiseLevel: '24.6 dBA',
                socket: 'Multiple',
                warranty: '6 Years'
            },
            rating: 4.9,
            reviews: 421,
            inStock: true,
            badge: 'sale'
        },
        {
            id: 'cool-002',
            name: 'Corsair H150i Elite Capellix 360mm',
            description: '360mm AIO liquid cooler, RGB pump, 3x 120mm ML fans',
            price: 249.99,
            image: 'https://via.placeholder.com/300x300/000000/ffffff?text=Corsair+H150i+Elite',
            category: 'cooling',
            brand: 'Corsair',
            specs: {
                type: 'AIO Liquid',
                radiatorSize: '360mm',
                fanSize: '3x 120mm',
                noiseLevel: '25 dBA',
                socket: 'Multiple',
                warranty: '5 Years'
            },
            rating: 4.7,
            reviews: 287,
            inStock: true
        }
    ],
    cases: [
        {
            id: 'case-001',
            name: 'Lian Li Lancool 216',
            description: 'Mid-tower case, 2x 160mm fans, tempered glass, excellent airflow',
            price: 99.99,
            image: 'https://via.placeholder.com/300x300/6c757d/ffffff?text=Lian+Li+Lancool+216',
            category: 'cases',
            brand: 'Lian Li',
            specs: {
                type: 'Mid Tower',
                material: 'Steel + TG',
                motherboard: 'ATX/mATX/ITX',
                fans: '2x 160mm',
                radiator: '360mm top',
                warranty: '2 Years'
            },
            rating: 4.8,
            reviews: 198,
            inStock: true,
            badge: 'new'
        },
        {
            id: 'case-002',
            name: 'Fractal Design Meshify 2 Compact',
            description: 'Mid-tower case, mesh front panel, excellent airflow, compact design',
            price: 89.99,
            originalPrice: 99.99,
            image: 'https://via.placeholder.com/300x300/000000/ffffff?text=Fractal+Meshify+2',
            category: 'cases',
            brand: 'Fractal Design',
            specs: {
                type: 'Mid Tower',
                material: 'Steel + TG',
                motherboard: 'ATX/mATX/ITX',
                fans: '2x 140mm',
                radiator: '280mm top',
                warranty: '2 Years'
            },
            rating: 4.7,
            reviews: 234,
            inStock: true,
            badge: 'sale'
        }
    ]
};

// Get all products as a flat array
function getAllProducts() {
    return Object.values(products).flat();
}

// Get products by category
function getProductsByCategory(category) {
    return products[category] || [];
}

// Get product by ID
function getProductById(id) {
    return getAllProducts().find(product => product.id === id);
}

// Get featured products
function getFeaturedProducts(limit = 8) {
    return getAllProducts()
        .filter(product => product.badge === 'hot' || product.badge === 'new')
        .slice(0, limit);
}

// Get deal products
function getDealProducts(limit = 4) {
    return getAllProducts()
        .filter(product => product.originalPrice && product.originalPrice > product.price)
        .slice(0, limit);
}

// Search products
function searchProducts(query) {
    const searchTerm = query.toLowerCase();
    return getAllProducts().filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
}

// Filter products
function filterProducts(categoryFilters, brandFilters, priceRange, sortBy) {
    let filtered = getAllProducts();
    
    // Filter by category
    if (categoryFilters.length > 0) {
        filtered = filtered.filter(product => categoryFilters.includes(product.category));
    }
    
    // Filter by brand
    if (brandFilters.length > 0) {
        filtered = filtered.filter(product => brandFilters.includes(product.brand));
    }
    
    // Filter by price range
    if (priceRange.min > 0) {
        filtered = filtered.filter(product => product.price >= priceRange.min);
    }
    if (priceRange.max < Infinity) {
        filtered = filtered.filter(product => product.price <= priceRange.max);
    }
    
    // Sort products
    switch (sortBy) {
        case 'price-low':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
        case 'name':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
        default:
            // Default sort (featured first)
            filtered.sort((a, b) => {
                if (a.badge === 'hot' && b.badge !== 'hot') return -1;
                if (a.badge !== 'hot' && b.badge === 'hot') return 1;
                return 0;
            });
    }
    
    return filtered;
}

// Get unique brands
function getUniqueBrands() {
    const brands = new Set();
    getAllProducts().forEach(product => brands.add(product.brand));
    return Array.from(brands).sort();
}

// Get price range
function getPriceRange() {
    const allProducts = getAllProducts();
    const prices = allProducts.map(product => product.price);
    return {
        min: Math.min(...prices),
        max: Math.max(...prices)
    };
}
