// Products Page JavaScript

// Firebase integration
let firebaseDB, firebaseRef, firebaseGet;

document.addEventListener('DOMContentLoaded', async function() {
    // Show loading state initially
    showProductsLoadingState();
    
    // Initialize Firebase for products page
    await initializeFirebase();
    
    // Initialize brand filters
    initializeBrandFilters();
    
    // Load products from Firebase
    await loadProductsFromFirebase();
    
    // Check for URL parameters
    handleURLParameters();
    
    // Initialize search
    initializeSearch();

    // Initialize mobile filters drawer
    initializeMobileFiltersDrawer();
});

function initializeMobileFiltersDrawer() {
    const openBtn = document.getElementById('mobileFiltersBtn');
    const closeBtn = document.getElementById('mobileCloseFiltersBtn');
    const overlay = document.getElementById('filtersOverlay');
    const filtersColumn = document.getElementById('filtersColumn');

    if (!openBtn || !closeBtn || !overlay || !filtersColumn) return;

    const setOpen = (open) => {
        document.body.classList.toggle('filters-open', open);
    };

    const isMobile = () => window.matchMedia && window.matchMedia('(max-width: 991.98px)').matches;

    const syncLayout = () => {
        if (isMobile()) {
            filtersColumn.style.display = 'contents';
        } else {
            setOpen(false);
            filtersColumn.style.display = '';
        }
    };

    openBtn.addEventListener('click', () => {
        if (!isMobile()) return;
        setOpen(true);
    });

    closeBtn.addEventListener('click', () => setOpen(false));
    overlay.addEventListener('click', () => setOpen(false));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setOpen(false);
    });

    window.addEventListener('resize', syncLayout);
    syncLayout();
}

// Initialize Firebase
async function initializeFirebase() {
    try {
        const { initializeApp } = await import("https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js");
        const { getDatabase, ref, get } = await import("https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js");
        
        // Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyDhy1IWM62djijn4vRUNmfYFTA3tGPY5tU",
            authDomain: "fast-tech-computer.firebaseapp.com",
            databaseURL: "https://fast-tech-computer-default-rtdb.firebaseio.com",
            projectId: "fast-tech-computer",
            storageBucket: "fast-tech-computer.firebasestorage.app",
            messagingSenderId: "503689724923",
            appId: "1:503689724923:web:0c6196cdffc88905dc415e"
        };
        
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        firebaseDB = getDatabase(app);
        firebaseRef = ref;
        firebaseGet = get;
        
        console.log('%c✅ Firebase initialized for products page', 'color: green; font-weight: bold;');
        return true;
    } catch (error) {
        console.error('%c❌ Error initializing Firebase on products page:', 'color: red; font-weight: bold;', error);
        return false;
    }
}

// Load products from Firebase
async function loadProductsFromFirebase() {
    try {
        // Check if Firebase is fully initialized
        if (!firebaseDB || !firebaseRef || !firebaseGet) {
            console.error('❌ Firebase not initialized on products page');
            displayProducts([]);
            return;
        }
        
        console.log('🔄 Loading products from Firebase on products page...');
        
        // Verify Firebase connection is working  
        if (!firebaseDB.app) {
            console.error('❌ Firebase app instance not available on products page');
            displayProducts([]);
            return;
        }
        
        const productsRef = firebaseRef(firebaseDB, 'products');
        const snapshot = await firebaseGet(productsRef);
        
        if (snapshot.exists()) {
            const data = snapshot.val();
            console.log('✅ Firebase data received on products page:', data);
            
            // Validate data structure
            if (!data || (typeof data !== 'object')) {
                console.error('❌ Invalid data structure from Firebase:', typeof data);
                showProductsEmptyState();
                return;
            }
            
            // Update the local products array from Firebase
            updateProductsFromFirebase(data);
            
            const allProducts = getAllProducts();
            console.log('✅ Products loaded from Firebase:', allProducts.length);
            
            if (allProducts.length === 0) {
                console.warn('⚠️ No products found in Firebase');
                showProductsEmptyState();
                return;
            }
            
            // Apply filters and display
            applyFilters();
        } else {
            console.log('⚠️ No products found in Firebase (snapshot does not exist)');
            showProductsEmptyState();
        }
    } catch (error) {
        console.error('❌ Error loading products from Firebase:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            code: error.code,
            stack: error.stack
        });
        displayProducts([]);
    }
}

// Show loading state for products page
function showProductsLoadingState() {
    const container = document.getElementById('productsGrid');
    const resultCount = document.getElementById('resultCount');
    
    if (container) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3 text-muted">Loading products from database...</p>
            </div>
        `;
    }
    
    if (resultCount) {
        resultCount.textContent = '0';
    }
}

// Show empty state for products page
function showProductsEmptyState() {
    const container = document.getElementById('productsGrid');
    const resultCount = document.getElementById('resultCount');
    
    if (container) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-box display-1 text-muted mb-3"></i>
                <h4>No Products Available</h4>
                <p class="text-muted">Products will appear here once added by the administrator</p>
            </div>
        `;
    }
    
    if (resultCount) {
        resultCount.textContent = '0';
    }
}

// Initialize brand filters
function initializeBrandFilters() {
    const brandFilters = document.getElementById('brandFilters');
    if (!brandFilters) return;
    
    const brands = getUniqueBrands();
    brandFilters.innerHTML = brands.map(brand => `
        <div class="filter-option">
            <label>
                <input type="checkbox" value="${brand}" onchange="applyFilters()">
                ${brand}
            </label>
        </div>
    `).join('');
}

// Load products
function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const noResults = document.getElementById('noResults');
    
    if (!productsGrid) return;
    
    // Show loading spinner
    if (loadingSpinner) loadingSpinner.style.display = 'block';
    if (noResults) noResults.style.display = 'none';
    
    // Simulate loading delay for better UX
    setTimeout(() => {
        const products = getAllProducts();
        displayProducts(products);
        
        if (loadingSpinner) loadingSpinner.style.display = 'none';
        updateResultCount(products.length);
    }, 500);
}

// Display products
function displayProducts(products) {
    const productsGrid = document.getElementById('productsGrid');
    const noResults = document.getElementById('noResults');
    
    if (!productsGrid) return;
    
    if (products.length === 0) {
        productsGrid.innerHTML = '';
        if (noResults) noResults.style.display = 'block';
        return;
    }
    
    if (noResults) noResults.style.display = 'none';
    
    productsGrid.innerHTML = products.map(product => createProductCard(product)).join('');
    
    // Add fade-in animation
    const cards = productsGrid.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('fade-in');
        }, index * 50);
    });
    
    // Load real reviews for each product card
    loadReviewsForProducts(products);
}

// Load real reviews from Firebase for all displayed products
async function loadReviewsForProducts(products) {
    for (const product of products) {
        loadProductReviews(product.id);
    }
}

// Load reviews for a single product and update the card
async function loadProductReviews(productId) {
    try {
        if (!firebaseDB || !firebaseRef || !firebaseGet) {
            console.log('Firebase not available for reviews');
            return;
        }
        
        const reviewsRef = firebaseRef(firebaseDB, `reviews/${productId}`);
        const snapshot = await firebaseGet(reviewsRef);
        
        if (snapshot.exists()) {
            const reviewsData = snapshot.val();
            const reviews = Array.isArray(reviewsData) ? reviewsData : Object.values(reviewsData);
            const validReviews = reviews.filter(r => r && typeof r === 'object');
            
            if (validReviews.length > 0) {
                // Calculate average rating
                const averageRating = (validReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / validReviews.length).toFixed(1);
                
                // Update product card with real reviews
                const ratingElement = document.getElementById(`rating-${productId}`);
                const reviewCountElement = document.getElementById(`review-count-${productId}`);
                
                if (ratingElement && reviewCountElement) {
                    ratingElement.innerHTML = createRatingStars(averageRating);
                    reviewCountElement.textContent = `(${validReviews.length})`;
                    
                    console.log(`✅ Updated reviews for product ${productId}: ${averageRating} stars from ${validReviews.length} reviews`);
                }
            }
        }
    } catch (error) {
        console.error(`Error loading reviews for product ${productId}:`, error);
    }
}

// Create product card HTML (same as main.js but included here for independence)
function createProductCard(product) {
    const badgeHtml = product.badge ? 
        `<span class="product-badge badge-${product.badge}">${product.badge.toUpperCase()}</span>` : '';
    
    const originalPriceHtml = product.originalPrice ? 
        `<span class="original-price">${formatPrice(product.originalPrice)}</span>` : '';
    
    const ratingHtml = createRatingStars(product.rating);
    
    // Stock status
    const quantity = product.quantity || 0;
    const lowStockLevel = product.lowStockLevel || 5;
    let stockStatusHtml = '';
    
    if (quantity === 0) {
        stockStatusHtml = '<p class="stock-status out-of-stock"><i class="bi bi-x-circle"></i> Out of Stock</p>';
    } else if (quantity < lowStockLevel) {
        stockStatusHtml = `<p class="stock-status low-stock"><i class="bi bi-exclamation-triangle"></i> Only ${quantity} left!</p>`;
    } else {
        stockStatusHtml = `<p class="stock-status in-stock"><i class="bi bi-check-circle"></i> In Stock (${quantity})</p>`;
    }
    
    return `
        <div class="col-md-6 col-lg-4">
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    ${badgeHtml}
                </div>
                <div class="product-body">
                    <h5 class="product-title">${product.name}</h5>
                    <p class="product-description">${product.description}</p>
                    <div class="product-rating">
                        ${ratingHtml}
                        <small class="text-muted">(${product.reviews} reviews)</small>
                    </div>
                    <div class="product-price">
                        ${formatPrice(product.price)}
                        ${originalPriceHtml}
                    </div>
                    ${stockStatusHtml}
                    <div class="d-grid gap-2">
                        <a href="product.html?id=${product.id}" class="btn btn-outline-primary">View Details</a>
                        <button class="btn btn-primary order-btn" onclick="handleOrderClick('${product.name}')" ${quantity === 0 ? 'disabled' : ''}>
                            <i class="bi bi-facebook"></i> Make an Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Create rating stars (same as main.js)
function createRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="bi bi-star-fill star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="bi bi-star-half star"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="bi bi-star star empty"></i>';
    }
    
    return stars;
}

// Apply filters
function applyFilters() {
    const categoryFilters = getCheckedValues('#categoryFilters input[type="checkbox"]');
    const brandFilters = getCheckedValues('#brandFilters input[type="checkbox"], #brandFiltersExpand input[type="checkbox"]');
    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;
    const sortBy = document.getElementById('sortSelect').value;
    
    const filteredProducts = filterProducts(
        categoryFilters,
        brandFilters,
        { min: minPrice, max: maxPrice },
        sortBy
    );
    
    displayProducts(filteredProducts);
    updateResultCount(filteredProducts.length);
}

// Get checked values from checkboxes
function getCheckedValues(selector) {
    const checkboxes = document.querySelectorAll(selector);
    return Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
}

// Update result count
function updateResultCount(count) {
    const resultCount = document.getElementById('resultCount');
    if (resultCount) {
        resultCount.textContent = count;
    }
}

// Clear all filters
function clearFilters() {
    // Clear checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    
    // Clear price inputs
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    
    // Reset sort
    document.getElementById('sortSelect').value = 'featured';
    
    // Reload all products
    loadProducts();
}

// Handle URL parameters
function handleURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (category) {
        // Check the category checkbox
        const categoryCheckbox = document.querySelector(`#categoryFilters input[value="${category}"]`);
        if (categoryCheckbox) {
            categoryCheckbox.checked = true;
            applyFilters();
        }
        
        // Update page title
        const pageTitle = document.querySelector('h1');
        if (pageTitle) {
            const categoryName = category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
            pageTitle.textContent = categoryName;
        }
    }
}

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();
        
        if (query.length < 2) {
            hideSearchResults();
            return;
        }
        
        searchTimeout = setTimeout(() => {
            performSearch(query);
        }, 300);
    });
    
    // Add search results container if it doesn't exist
    if (!document.querySelector('.search-results')) {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container position-relative';
        searchInput.parentNode.insertBefore(searchContainer, searchInput);
        searchContainer.appendChild(searchInput);
        
        const searchResults = document.createElement('div');
        searchResults.className = 'search-results';
        searchContainer.appendChild(searchResults);
    }
    
    // Hide search results when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-container')) {
            hideSearchResults();
        }
    });
}

// Perform search
function performSearch(query) {
    const results = searchProducts(query);
    displaySearchResults(results, query);
}

// Display search results
function displaySearchResults(results, query) {
    const searchResults = document.querySelector('.search-results');
    if (!searchResults) return;
    
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="search-result-item">
                <p class="text-muted mb-0">No products found for "${query}"</p>
            </div>
        `;
    } else {
        searchResults.innerHTML = results.slice(0, 5).map(product => `
            <div class="search-result-item" onclick="window.location.href='product.html?id=${product.id}'">
                <div class="d-flex align-items-center">
                    <img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 1rem;">
                    <div>
                        <h6 class="mb-0">${product.name}</h6>
                        <small class="text-muted">${product.category} - $${product.price.toFixed(2)}</small>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    searchResults.style.display = 'block';
}

// Hide search results
function hideSearchResults() {
    const searchResults = document.querySelector('.search-results');
    if (searchResults) {
        searchResults.style.display = 'none';
    }
}

// Order system activated (advertisement-based)
// Cart functionality removed - using order.js instead
