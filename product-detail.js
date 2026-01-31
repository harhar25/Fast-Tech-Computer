// Product Detail Page JavaScript

// Firebase integration
let firebaseDB, firebaseRef, firebaseGet;

document.addEventListener('DOMContentLoaded', async function() {
    console.log('%c📄 Product Detail Page - DOMContentLoaded', 'color: blue; font-weight: bold;');
    
    // Initialize Firebase and load products first
    await initializeFirebaseForProductDetail();
    
    // Now load product details
    loadProductDetails();
    
    initializeSearch();
});

// Initialize Firebase for product detail page
async function initializeFirebaseForProductDetail() {
    try {
        console.log('%c🔄 Initializing Firebase for product detail page...', 'color: orange;');
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
        
        console.log('%c✅ Firebase initialized for product detail page', 'color: green; font-weight: bold;');
        
        // Load products from Firebase
        console.log('%c🔄 Loading products from Firebase...', 'color: blue;');
        const productsRef = firebaseRef(firebaseDB, 'products');
        const snapshot = await firebaseGet(productsRef);
        
        if (snapshot.exists()) {
            const data = snapshot.val();
            console.log('%c✅ Products loaded from Firebase', 'color: green;');
            
            // Update the local products array from Firebase
            updateProductsFromFirebase(data);
            
            const allProducts = getAllProducts();
            console.log('%c✅ Total products available:', 'color: green;', allProducts.length);
        } else {
            console.log('%c⚠️ No products found in Firebase', 'color: orange;');
        }
    } catch (error) {
        console.error('%c❌ Error initializing Firebase for product detail:', 'color: red; font-weight: bold;', error);
    }
}



// Load product details
function loadProductDetails() {
    console.log('%c📦 loadProductDetails() called', 'color: blue;');
    
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    console.log('%c🔍 Product ID from URL:', 'color: blue;', productId);
    
    if (!productId) {
        console.log('%c❌ No product ID provided in URL', 'color: red;');
        showProductNotFound();
        return;
    }
    
    console.log('%c🔍 Searching for product:', 'color: blue;', productId);
    console.log('%c📋 Available products:', 'color: blue;', getAllProducts());
    
    const product = getProductById(productId);
    
    if (!product) {
        console.error('%c❌ Product not found with ID:', 'color: red; font-weight: bold;', productId);
        console.log('%c📊 Total products in system:', 'color: orange;', getAllProducts().length);
        showProductNotFound();
        return;
    }
    
    console.log('%c✅ Product found:', 'color: green; font-weight: bold;', product);
    
    displayProductDetails(product);
    loadRelatedProducts(product);
    updateBreadcrumb(product);
    updatePageTitle(product);
}

// Display product details
function displayProductDetails(product) {
    const container = document.getElementById('productDetails');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const productNotFound = document.getElementById('productNotFound');
    
    if (!container) return;
    
    // Hide loading and error states
    if (loadingSpinner) loadingSpinner.style.display = 'none';
    if (productNotFound) productNotFound.style.display = 'none';
    
    const badgeHtml = product.badge ? 
        `<span class="product-badge badge-${product.badge}">${product.badge.toUpperCase()}</span>` : '';
    
    const originalPriceHtml = product.originalPrice ? 
        `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : '';
    
    const ratingHtml = createRatingStars(product.rating);
    
    const specsHtml = Object.entries(product.specs).map(([key, value]) => {
        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        return `
            <tr>
                <td><strong>${label}:</strong></td>
                <td>${value}</td>
            </tr>
        `;
    }).join('');
    
    container.innerHTML = `
        <div class="col-lg-6 mb-4">
            <div class="product-image-large">
                <img src="${product.image}" alt="${product.name}" class="img-fluid rounded">
                ${badgeHtml}
            </div>
        </div>
        <div class="col-lg-6">
            <div class="product-info">
                <h1 class="mb-3">${product.name}</h1>
                <div class="product-rating mb-3">
                    ${ratingHtml}
                    <span class="text-muted">(${product.reviews} reviews)</span>
                </div>
                <div class="product-price mb-4">
                    <span class="display-6 fw-bold text-primary">${formatPrice(product.price)}</span>
                    ${originalPriceHtml}
                </div>
                <p class="lead mb-4">${product.description}</p>
                
                <div class="mb-4">
                    <div class="d-flex align-items-center mb-3">
                        <span class="badge bg-${product.inStock ? 'success' : 'danger'} me-2">
                            ${product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                        <span class="text-muted">Brand: ${product.brand}</span>
                    </div>
                </div>
                
                <div class="d-flex gap-3 mb-4">
                    <button class="btn btn-primary btn-lg ${!product.inStock ? 'disabled' : ''}" 
                            onclick="addToCart('${product.id}')" 
                            ${!product.inStock ? 'disabled' : ''}>
                        <i class="bi bi-cart-plus"></i> Add to Cart
                    </button>
                    <button class="btn btn-outline-primary btn-lg">
                        <i class="bi bi-heart"></i> Wishlist
                    </button>
                </div>
                
                <div class="product-features mb-4">
                    <h5>Key Features</h5>
                    <ul class="list-unstyled">
                        <li><i class="bi bi-check-circle text-success me-2"></i>Premium Quality Components</li>
                        <li><i class="bi bi-check-circle text-success me-2"></i>Manufacturer Warranty</li>
                        <li><i class="bi bi-check-circle text-success me-2"></i>Fast Shipping</li>
                        <li><i class="bi bi-check-circle text-success me-2"></i>Expert Support</li>
                    </ul>
                </div>
                
                <div class="shipping-info mb-4">
                    <h5>Shipping & Returns</h5>
                    <div class="row">
                        <div class="col-md-6">
                            <p class="mb-2"><i class="bi bi-truck me-2"></i>Free shipping on orders over $100</p>
                            <p class="mb-2"><i class="bi bi-clock me-2"></i>Fast delivery: 2-3 business days</p>
                        </div>
                        <div class="col-md-6">
                            <p class="mb-2"><i class="bi bi-arrow-repeat me-2"></i>30-day return policy</p>
                            <p class="mb-2"><i class="bi bi-shield-check me-2"></i>1-year manufacturer warranty</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="col-12 mt-5">
            <div class="product-specs">
                <h3 class="mb-4">Technical Specifications</h3>
                <div class="table-responsive">
                    <table class="table table-striped">
                        <tbody>
                            ${specsHtml}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
        <div class="col-12 mt-5">
            <div class="product-reviews">
                <h3 class="mb-4">Customer Reviews</h3>
                <div class="mb-4">
                    <div class="d-flex align-items-center mb-3">
                        <div class="me-3">
                            <div class="display-4 fw-bold">${product.rating}</div>
                            <div>${ratingHtml}</div>
                        </div>
                        <div>
                            <p class="mb-0">Based on ${product.reviews} reviews</p>
                            <div class="progress" style="height: 8px;">
                                <div class="progress-bar bg-warning" style="width: ${(product.rating / 5) * 100}%"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="review-summary">
                    <h5>Review Summary</h5>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="d-flex justify-content-between mb-2">
                                <span>5 Stars</span>
                                <div class="progress flex-grow-1 mx-3" style="height: 8px;">
                                    <div class="progress-bar bg-warning" style="width: 60%"></div>
                                </div>
                                <span>60%</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span>4 Stars</span>
                                <div class="progress flex-grow-1 mx-3" style="height: 8px;">
                                    <div class="progress-bar bg-warning" style="width: 25%"></div>
                                </div>
                                <span>25%</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span>3 Stars</span>
                                <div class="progress flex-grow-1 mx-3" style="height: 8px;">
                                    <div class="progress-bar bg-warning" style="width: 10%"></div>
                                </div>
                                <span>10%</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span>2 Stars</span>
                                <div class="progress flex-grow-1 mx-3" style="height: 8px;">
                                    <div class="progress-bar bg-warning" style="width: 3%"></div>
                                </div>
                                <span>3%</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span>1 Star</span>
                                <div class="progress flex-grow-1 mx-3" style="height: 8px;">
                                    <div class="progress-bar bg-warning" style="width: 2%"></div>
                                </div>
                                <span>2%</span>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <button class="btn btn-outline-primary w-100">Write a Review</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Load related products
function loadRelatedProducts(currentProduct) {
    const relatedSection = document.getElementById('relatedSection');
    const relatedProducts = document.getElementById('relatedProducts');
    
    if (!relatedSection || !relatedProducts) return;
    
    // Get products from the same category
    const sameCategoryProducts = getProductsByCategory(currentProduct.category)
        .filter(p => p.id !== currentProduct.id)
        .slice(0, 4);
    
    if (sameCategoryProducts.length === 0) {
        return;
    }
    
    relatedSection.style.display = 'block';
    
    relatedProducts.innerHTML = sameCategoryProducts.map(product => createRelatedProductCard(product)).join('');
}

// Create related product card
function createRelatedProductCard(product) {
    const badgeHtml = product.badge ? 
        `<span class="product-badge badge-${product.badge}">${product.badge.toUpperCase()}</span>` : '';
    
    const originalPriceHtml = product.originalPrice ? 
        `<span class="original-price">${formatPrice(product.originalPrice)}</span>` : '';
    
    const ratingHtml = createRatingStars(product.rating);
    
    return `
        <div class="col-md-6 col-lg-3">
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
                    <div class="d-grid gap-2">
                        <a href="product.html?id=${product.id}" class="btn btn-outline-primary">View Details</a>
                        <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}">
                            <i class="bi bi-cart-plus"></i> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Create rating stars
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

// Update breadcrumb
function updateBreadcrumb(product) {
    const breadcrumbCategory = document.getElementById('breadcrumbCategory');
    const breadcrumbProduct = document.getElementById('breadcrumbProduct');
    
    if (breadcrumbCategory) {
        const categoryName = product.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
        breadcrumbCategory.innerHTML = `<a href="products.html?category=${product.category}">${categoryName}</a>`;
    }
    
    if (breadcrumbProduct) {
        breadcrumbProduct.textContent = product.name;
    }
}

// Update page title
function updatePageTitle(product) {
    document.title = `${product.name} - Fast Tech Computer Parts Store`;
}

// Show product not found
function showProductNotFound() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const productNotFound = document.getElementById('productNotFound');
    const productDetails = document.getElementById('productDetails');
    
    if (loadingSpinner) loadingSpinner.style.display = 'none';
    if (productNotFound) productNotFound.style.display = 'block';
    if (productDetails) productDetails.style.display = 'none';
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
                        <small class="text-muted">${product.category} - ${formatPrice(product.price)}</small>
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

// Add to cart button handler
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart-btn')) {
        const productId = e.target.dataset.productId;
        cart.addItem(productId);
    }
});

// Cart button click handler
document.addEventListener('DOMContentLoaded', function() {
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', function() {
            const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
            cartModal.show();
        });
    }
});
