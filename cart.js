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
                            <div class="cart-item-price">$${product.price.toFixed(2)}</div>
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

// Quick add to cart from product cards
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart-btn')) {
        const productId = e.target.dataset.productId;
        addToCart(productId);
    }
});
