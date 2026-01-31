// Products Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize brand filters
    initializeBrandFilters();
    
    // Load products
    loadProducts();
    
    // Check for URL parameters
    handleURLParameters();
    
    // Initialize search
    initializeSearch();
});

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
}

// Create product card HTML (same as main.js but included here for independence)
function createProductCard(product) {
    const badgeHtml = product.badge ? 
        `<span class="product-badge badge-${product.badge}">${product.badge.toUpperCase()}</span>` : '';
    
    const originalPriceHtml = product.originalPrice ? 
        `<span class="original-price">${formatPrice(product.originalPrice)}</span>` : '';
    
    const ratingHtml = createRatingStars(product.rating);
    
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
    const brandFilters = getCheckedValues('#brandFilters input[type="checkbox"]');
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
