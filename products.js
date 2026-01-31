// Product Database - Now connected to Firebase
// This file provides fallback functions and structure
// All products are now stored in Firebase Realtime Database

const products = {
    processors: [],
    'graphics-cards': [],
    memory: [],
    storage: [],
    motherboards: [],
    'power-supplies': [],
    cooling: [],
    cases: []
};

// Firebase connection will be handled in the admin panel
// These functions provide compatibility with existing code

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
    if (allProducts.length === 0) {
        return { min: 0, max: 10000 };
    }
    const prices = allProducts.map(product => product.price);
    return {
        min: Math.min(...prices),
        max: Math.max(...prices)
    };
}

// Firebase integration functions
// These will be used by the main website to load products from Firebase

// Load products from Firebase (to be implemented in main.js)
async function loadProductsFromFirebase() {
    try {
        // This function will be implemented in main.js
        // It will connect to Firebase and update the products object
        console.log('Loading products from Firebase...');
        return [];
    } catch (error) {
        console.error('Error loading products from Firebase:', error);
        return [];
    }
}

// Update local products array from Firebase data
function updateProductsFromFirebase(firebaseData) {
    // Clear existing products
    Object.keys(products).forEach(category => {
        products[category] = [];
    });
    
    // Load products from Firebase
    if (firebaseData) {
        Object.keys(firebaseData).forEach(category => {
            if (products.hasOwnProperty(category) && Array.isArray(firebaseData[category])) {
                products[category] = firebaseData[category];
            }
        });
    }
    
    console.log('Products updated from Firebase:', getAllProducts().length, 'products loaded');
    console.log('Updated products array:', products);
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        products,
        getAllProducts,
        getProductsByCategory,
        getProductById,
        getFeaturedProducts,
        getDealProducts,
        searchProducts,
        filterProducts,
        getUniqueBrands,
        getPriceRange,
        loadProductsFromFirebase,
        updateProductsFromFirebase
    };
}
