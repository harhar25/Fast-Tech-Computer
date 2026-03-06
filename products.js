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
    cases: [],
    'cctv-cameras': [],
    laptops: []
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
        .filter(product => product.badge === 'sale')
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
    console.log('🔥 FIREBASE DATA RECEIVED:', firebaseData);
    
    // Clear existing products
    Object.keys(products).forEach(category => {
        products[category] = [];
    });
    
    // Validate input
    if (!firebaseData || typeof firebaseData !== 'object') {
        console.error('❌ Invalid Firebase data format:', typeof firebaseData);
        return;
    }
    
    // Load products from Firebase
    try {
        Object.keys(firebaseData).forEach(category => {
            // Only process known categories
            if (products.hasOwnProperty(category)) {
                const categoryData = firebaseData[category];
                
                if (!categoryData) {
                    console.log(`⚠️ Category "${category}" is empty or null`);
                    products[category] = [];
                    return;
                }
                
                // Firebase can return data in two formats:
                // 1. Array: [{...}, {...}]
                // 2. Object with numeric keys: {0: {...}, 1: {...}}
                
                try {
                    if (Array.isArray(categoryData)) {
                        // Already an array, use directly
                        // Validate array elements
                        const validProducts = categoryData.filter(item => {
                            if (!item || typeof item !== 'object') {
                                console.warn(`⚠️ Invalid product item in category "${category}":`, item);
                                return false;
                            }
                            return true;
                        });
                        products[category] = validProducts;
                        console.log(`✅ Category "${category}" loaded as array: ${validProducts.length} valid products`);
                    } else if (typeof categoryData === 'object' && categoryData !== null) {
                        // Convert object to array
                        const convertedArray = Object.values(categoryData).filter(item => {
                            if (!item || typeof item !== 'object') {
                                console.warn(`⚠️ Invalid product item in category "${category}":`, item);
                                return false;
                            }
                            return true;
                        });
                        products[category] = convertedArray;
                        console.log(`✅ Category "${category}" converted from object to array: ${convertedArray.length} valid products`);
                    } else {
                        console.warn(`⚠️ Category "${category}" has invalid data type:`, typeof categoryData);
                        products[category] = [];
                    }
                } catch (conversionError) {
                    console.error(`❌ Error processing category "${category}":`, conversionError);
                    products[category] = [];
                }
            } else {
                console.log(`ℹ️ Skipping unknown category: "${category}"`);
            }
        });
    } catch (error) {
        console.error('❌ Error processing Firebase data:', error);
    }
    
    const totalProducts = getAllProducts().length;
    console.log(`✅ Total products loaded: ${totalProducts}`);
    console.log('📦 Products structure:', products);
    console.log('📋 All products flattened:', getAllProducts());
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
