// Shopping Cart Management
class ShoppingCart {
    constructor() {
        this.items = [];
        this.loadFromStorage();
        this.updateUI();
    }

    // Load cart from localStorage
    loadFromStorage() {
        const stored = localStorage.getItem('cart');
        if (stored) {
            this.items = JSON.parse(stored);
        }
    }

    // Save cart to localStorage
    saveToStorage() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    // Add item to cart
    addItem(productId, quantity = 1) {
        const existingItem = this.items.find(item => item.productId === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                productId: productId,
                quantity: quantity,
                addedAt: new Date().toISOString()
            });
        }
        
        this.saveToStorage();
        this.updateUI();
        this.showNotification('Product added to cart!', 'success');
    }

    // Remove item from cart
    removeItem(productId) {
        this.items = this.items.filter(item => item.productId !== productId);
        this.saveToStorage();
        this.updateUI();
        this.showNotification('Product removed from cart!', 'info');
    }

    // Update item quantity
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.productId === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveToStorage();
                this.updateUI();
            }
        }
    }

    // Get cart total
    getTotal() {
        let total = 0;
        this.items.forEach(item => {
            const product = getProductById(item.productId);
            if (product) {
                total += product.price * item.quantity;
            }
        });
        return total;
    }

    // Get cart item count
    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    // Clear cart
    clearCart() {
        this.items = [];
        this.saveToStorage();
        this.updateUI();
        this.showNotification('Cart cleared!', 'info');
    }

    // Update UI elements
    updateUI() {
        // Update cart count
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const count = this.getItemCount();
            cartCount.textContent = count;
            cartCount.style.display = count > 0 ? 'block' : 'none';
        }

        // Update cart modal
        this.updateCartModal();
    }

    // Update cart modal content
    updateCartModal() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        
        if (!cartItems || !cartTotal) return;

        if (this.items.length === 0) {
            cartItems.innerHTML = `
                <div class="text-center py-4">
                    <i class="bi bi-cart-x display-4 text-muted mb-3"></i>
                    <p class="text-muted">Your cart is empty</p>
                    <a href="products.html" class="btn btn-primary">Start Shopping</a>
                </div>
            `;
            cartTotal.textContent = '0.00';
            return;
        }

        let html = '';
        this.items.forEach(item => {
            const product = getProductById(item.productId);
            if (product) {
                html += `
                    <div class="cart-item">
                        <div class="cart-item-image">
                            <img src="${product.image}" alt="${product.name}" style="max-width: 100%; max-height: 100%;">
                        </div>
                        <div class="cart-item-details">
                            <div class="cart-item-title">${product.name}</div>
                            <div class="cart-item-price">${formatPrice(product.price)}</div>
                            <div class="quantity-control">
                                <button onclick="cart.updateQuantity('${item.productId}', ${item.quantity - 1})">-</button>
                                <input type="number" value="${item.quantity}" min="1" onchange="cart.updateQuantity('${item.productId}', parseInt(this.value))">
                                <button onclick="cart.updateQuantity('${item.productId}', ${item.quantity + 1})">+</button>
                            </div>
                        </div>
                        <button class="btn btn-sm btn-outline-danger" onclick="cart.removeItem('${item.productId}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                `;
            }
        });

        cartItems.innerHTML = html;
        cartTotal.textContent = this.getTotal().toFixed(2);
    }

    // Show notification
    showNotification(message, type = 'info') {
        const toastContainer = document.querySelector('.toast-container') || this.createToastContainer();
        
        const toast = document.createElement('div');
        toast.className = `custom-toast toast-${type}`;
        toast.innerHTML = `
            <div class="d-flex align-items-center p-3">
                <div class="flex-grow-1">
                    <strong>${type.charAt(0).toUpperCase() + type.slice(1)}</strong>
                    <div>${message}</div>
                </div>
                <button type="button" class="btn-close ms-2" onclick="this.parentElement.parentElement.remove()"></button>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // Create toast container if it doesn't exist
    createToastContainer() {
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
    }
}

// Initialize cart
const cart = new ShoppingCart();

// Add to cart button handler
function addToCart(productId) {
    cart.addItem(productId);
}

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

// Checkout functionality
document.addEventListener('click', function(e) {
    if (e.target.textContent.includes('Checkout') && e.target.classList.contains('btn-primary')) {
        e.preventDefault();
        
        const cartItems = cart.getItems();
        if (cartItems.length === 0) {
            alert('Your cart is empty. Add some products before checkout.');
            return;
        }
        
        // Show checkout modal or redirect to checkout page
        showCheckoutModal();
    }
});

// Show checkout modal
function showCheckoutModal() {
    // Create checkout modal if it doesn't exist
    let checkoutModal = document.getElementById('checkoutModal');
    if (!checkoutModal) {
        checkoutModal = createCheckoutModal();
        document.body.appendChild(checkoutModal);
    }
    
    // Show the modal
    const modal = new bootstrap.Modal(checkoutModal);
    modal.show();
}

// Create checkout modal HTML
function createCheckoutModal() {
    const modalDiv = document.createElement('div');
    modalDiv.className = 'modal fade';
    modalDiv.id = 'checkoutModal';
    modalDiv.setAttribute('tabindex', '-1');
    modalDiv.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Checkout</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-6">
                            <h6>Order Summary</h6>
                            <div id="checkoutItems"></div>
                            <hr>
                            <div class="d-flex justify-content-between">
                                <strong>Total:</strong>
                                <strong>₱<span id="checkoutTotal">0.00</span></strong>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <h6>Customer Information</h6>
                            <form id="checkoutForm">
                                <div class="mb-3">
                                    <label class="form-label">Full Name *</label>
                                    <input type="text" class="form-control" id="fullName" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Email *</label>
                                    <input type="email" class="form-control" id="email" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Phone *</label>
                                    <input type="tel" class="form-control" id="phone" required>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-success" onclick="processCheckout()">Place Order</button>
                </div>
            </div>
        </div>
    `;
    
    // Populate checkout items
    updateCheckoutModal();
    
    return modalDiv;
}

// Update checkout modal content
function updateCheckoutModal() {
    const cartItems = cart.getItems();
    const checkoutItems = document.getElementById('checkoutItems');
    const checkoutTotal = document.getElementById('checkoutTotal');
    
    if (checkoutItems) {
        checkoutItems.innerHTML = cartItems.map(item => `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div>
                    <strong>${item.name}</strong><br>
                    <small>Quantity: ${item.quantity}</small>
                </div>
                <span>₱${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('');
    }
    
    if (checkoutTotal) {
        checkoutTotal.textContent = cart.getTotal().toFixed(2);
    }
}

// Process checkout
function processCheckout() {
    const form = document.getElementById('checkoutForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const orderData = {
        items: cart.getItems(),
        total: cart.getTotal(),
        customer: {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value
        },
        date: new Date().toISOString()
    };
    
    // For demo purposes, just show success message
    alert('Order placed successfully! Order ID: ' + Math.random().toString(36).substr(2, 9).toUpperCase());
    
    // Clear cart and close modals
    cart.clear();
    
    // Close checkout modal
    const checkoutModal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
    if (checkoutModal) {
        checkoutModal.hide();
    }
    
    // Close cart modal
    const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
    if (cartModal) {
        cartModal.hide();
    }
    
    // Remove checkout modal from DOM
    setTimeout(() => {
        const modal = document.getElementById('checkoutModal');
        if (modal) {
            modal.remove();
        }
    }, 500);
}

// Fix modal backdrop issues
document.addEventListener('hidden.bs.modal', function(e) {
    // Remove any leftover backdrops
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => backdrop.remove());
    
    // Restore body classes
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
});

// Quick add to cart from product cards
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart-btn')) {
        const productId = e.target.dataset.productId;
        addToCart(productId);
    }
});
