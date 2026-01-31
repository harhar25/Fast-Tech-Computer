# Fast Tech Computer Parts Store

A modern, responsive e-commerce website for computer parts and components built with HTML5, CSS3, JavaScript, and Bootstrap 5.

## Features

### 🛍️ **Shopping Experience**
- **Product Catalog**: Browse 8 categories of computer components
- **Product Details**: Detailed product pages with specifications and reviews
- **Shopping Cart**: Add to cart functionality with quantity management
- **Search**: Real-time product search with autocomplete
- **Filters**: Advanced filtering by category, brand, and price range
- **Sorting**: Sort products by price, rating, and name

### 🎨 **Design & UX**
- **Responsive Design**: Mobile-first approach, works on all devices
- **Modern UI**: Clean, professional design with smooth animations
- **Interactive Elements**: Hover effects, transitions, and micro-interactions
- **Accessibility**: Semantic HTML5, ARIA labels, keyboard navigation

### 📦 **Product Categories**
- **Processors**: Intel & AMD CPUs
- **Graphics Cards**: NVIDIA & AMD GPUs
- **Memory**: DDR4 & DDR5 RAM modules
- **Storage**: SSDs and HDDs
- **Motherboards**: Intel and AMD platforms
- **Power Supplies**: Various wattage options
- **Cooling**: Air and liquid cooling solutions
- **Cases**: PC cases in different form factors

### 🛒 **E-commerce Features**
- **Product Badges**: New, Hot, Sale indicators
- **Customer Reviews**: Star ratings and review summaries
- **Wishlist**: Save products for later
- **Deals Section**: Special offers and discounts
- **Newsletter**: Email subscription for updates

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Framework**: Bootstrap 5.3.0
- **Icons**: Bootstrap Icons 1.11.0
- **Storage**: LocalStorage for cart persistence
- **Animations**: CSS3 transitions and keyframes

## File Structure

```
computer-parts-store/
├── index.html              # Homepage with hero section and featured products
├── products.html            # Product catalog with filters and search
├── product.html            # Individual product detail pages
├── styles.css              # Main stylesheet with custom styles
├── products.js             # Product database and utility functions
├── cart.js                 # Shopping cart functionality
├── main.js                 # Homepage JavaScript
├── products-page.js        # Products page JavaScript
├── product-detail.js       # Product detail page JavaScript
└── README.md               # This file
```

## Getting Started

1. **Download the files**: Extract or copy all files to your desired location
2. **Open the website**: Open `index.html` in your web browser
3. **No setup required**: Everything works out of the box with no dependencies

## Usage

### Browsing Products
- Navigate through categories using the dropdown menu
- Use the search bar to find specific products
- Apply filters to narrow down results
- Sort products by various criteria

### Shopping Cart
- Click "Add to Cart" on any product
- View cart contents by clicking the cart icon
- Adjust quantities or remove items
- Cart persists using localStorage

### Product Details
- Click "View Details" on any product card
- See full specifications, reviews, and related products
- Add to cart from the detail page

## Customization

### Adding Products
Edit `products.js` to add new products:

```javascript
{
    id: 'unique-product-id',
    name: 'Product Name',
    description: 'Product description',
    price: 999.99,
    category: 'category-slug',
    brand: 'Brand Name',
    specs: {
        // Product specifications
    },
    rating: 4.5,
    reviews: 100,
    inStock: true,
    badge: 'new' // optional: new, hot, sale
}
```

### Styling
- Modify `styles.css` for visual changes
- Bootstrap classes can be customized or overridden
- CSS variables are used for consistent theming

### Categories
Add new categories in:
1. `products.js` - Add products to new category
2. Navigation dropdown in HTML files
3. Filter checkboxes in products page

## Features in Detail

### Search Functionality
- Real-time search as you type
- Searches product names, descriptions, brands, and categories
- Autocomplete dropdown with product previews
- Click to navigate directly to product pages

### Filtering System
- **Category Filters**: Multi-select category checkboxes
- **Brand Filters**: Dynamic brand checkboxes based on available products
- **Price Range**: Min/max price inputs
- **Sort Options**: Featured, price (low/high), rating, name

### Cart System
- **LocalStorage**: Cart persists across browser sessions
- **Quantity Management**: Increment/decrement quantities
- **Real-time Updates**: Cart count updates instantly
- **Modal Interface**: Clean cart modal with item details

### Responsive Design
- **Mobile**: Optimized for phones and tablets
- **Tablet**: Adaptive layouts for medium screens
- **Desktop**: Full-featured experience on large screens
- **Touch-friendly**: Large tap targets and gestures

## Browser Compatibility

- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **Mobile Browsers**: iOS Safari, Chrome Mobile

## Performance

- **Optimized Images**: Placeholder images with proper sizing
- **Lazy Loading**: Images load as needed
- **Efficient JavaScript**: Debounced search, optimized DOM operations
- **CSS Animations**: Hardware-accelerated transitions
- **Minimal Dependencies**: Only Bootstrap CDN required

## Future Enhancements

- **Backend Integration**: Connect to a real e-commerce platform
- **Payment Processing**: Integrate payment gateways
- **User Accounts**: Customer registration and profiles
- **Order Tracking**: Real-time order status updates
- **Product Reviews**: User-submitted reviews and ratings
- **Wishlist Management**: Save and organize favorite products
- **Compare Products**: Side-by-side product comparison
- **Inventory Management**: Real-time stock levels
- **Shipping Calculator**: Dynamic shipping costs

## Support

This is a frontend demonstration project. For production use, consider:
- Adding a backend database
- Implementing secure payment processing
- Adding user authentication
- Setting up proper hosting and CDN

## License

This project is open source and available under the MIT License.
