# 💱 PHP Currency & Responsive Design - Quick Reference

## Currency Conversion Examples

| USD Price | PHP Price | Display |
|-----------|-----------|---------|
| $9.99 | ₱569.43 | ₱569.43 |
| $99.99 | ₱5,699.43 | ₱5,699.43 |
| $599.99 | ₱34,199.43 | ₱34,199.43 |

## Device Breakpoints

```
Extra Small: 320px - 480px  (Small Mobile)
├─ Single column product grid
├─ Minimal spacing
└─ Extra small fonts

Small: 481px - 768px  (Mobile)
├─ 2-column product grid
├─ Medium fonts
└─ Optimized buttons

Medium: 769px - 1199px  (Tablet)
├─ 2-column product grid
├─ Full fonts
└─ Larger spacing

Large: 1200px+  (Desktop)
├─ 4-column product grid
├─ Full features
└─ Maximum spacing
```

## File Quick Links

### Core Files
- `currency.js` - Currency conversion utility
- `main.js` - Homepage product display
- `products-page.js` - Products listing
- `product-detail.js` - Product details
- `cart.js` - Shopping cart
- `admin.js` - Admin dashboard

### Style Files
- `styles-enterprise.css` - Enterprise design + responsive
- `styles.css` - Additional responsive styles

### HTML Files Updated
- `index.html` - Added currency.js
- `products.html` - Added currency.js
- `product.html` - Added currency.js + cart format
- `admin.html` - Added currency.js + PHP labels

## Code Examples

### Using Currency Function
```javascript
// In any JavaScript file
formatPrice(99.99)        // Returns: "₱5,699.43"
formatPriceWithCode(99.99)  // Returns: "₱5,699.43 PHP"
getPHPPrice(99.99)        // Returns: 5699.43 (number)
```

### Product Card Display
```javascript
<span class="price-current">${formatPrice(product.price)}</span>
// Displays: ₱5,699.43
```

## Responsive Grid Layout

### Desktop (1200px+)
```
┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
│  P  │ │  P  │ │  P  │ │  P  │
├─────┤ ├─────┤ ├─────┤ ├─────┤
│  P  │ │  P  │ │  P  │ │  P  │
└─────┘ └─────┘ └─────┘ └─────┘
4 Columns
```

### Tablet (769px - 1199px)
```
┌──────┐ ┌──────┐
│  P   │ │  P   │
├──────┤ ├──────┤
│  P   │ │  P   │
└──────┘ └──────┘
2 Columns
```

### Mobile (480px)
```
┌────────┐
│   P    │
├────────┤
│   P    │
└────────┘
2 Columns
```

### Small Mobile (320px)
```
┌─────┐
│  P  │
├─────┤
│  P  │
└─────┘
1 Column
```

## Common Tasks

### Change Exchange Rate
```javascript
// In currency.js
exchangeRate: 60  // Change from 57 to desired rate
```

### Add New Breakpoint
```css
/* In styles-enterprise.css */
@media (max-width: 1440px) {
  /* Your styles here */
}
```

### Format Product Price in HTML
```javascript
// In JavaScript
const priceHtml = `Price: ${formatPrice(product.price)}`;

// In Template
<span>${formatPrice(product.price)}</span>
```

## Responsive CSS Features Used

- **CSS Grid** - Flexible product layouts
- **Flexbox** - Navigation and spacing
- **clamp()** - Responsive typography
- **Media Queries** - Device-specific styles
- **CSS Variables** - Consistent theming
- **Mobile-First** - Base styles then enhance

## Browser Support

✅ Chrome/Edge 88+
✅ Firefox 87+
✅ Safari 14+
✅ Mobile browsers (iOS 13+, Android 8+)

## Performance Tips

💡 CSS Grid is hardware-accelerated
💡 Minimal media query overhead
💡 JavaScript is lightweight (currency functions)
💡 Images scale automatically
💡 No JavaScript relayouts

## Debugging Responsive Issues

```javascript
// Check window width in console
console.log(window.innerWidth);

// Check current breakpoint
if (window.innerWidth < 768) {
  console.log("Mobile layout");
}
```

## Key CSS Properties

```css
/* Responsive Typography */
font-size: clamp(1rem, 4vw, 3rem);

/* Flexible Grids */
grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));

/* Mobile First */
@media (min-width: 768px) { ... }

/* Viewport Safe Padding */
padding: 1rem clamp(1rem, 5vw, 2rem);
```

---

## Quick Checklist for Testing

- [ ] Desktop: 4-column grid, full layout
- [ ] Tablet: 2-column grid, proper spacing
- [ ] Mobile: 2-column grid, readable text
- [ ] Small Mobile: 1-column, no scroll
- [ ] All prices show PHP currency
- [ ] No overlapping elements
- [ ] All buttons are clickable
- [ ] Images load and scale correctly
- [ ] Navigation is accessible
- [ ] Cart shows PHP totals

---
**Version**: 1.0 | **Last Updated**: January 2026
