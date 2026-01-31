// Currency Utility for PHP Pricing
// Prices are stored directly in PHP - no conversion needed
const CURRENCY_CONFIG = {
    symbol: '₱',
    code: 'PHP',
    decimalPlaces: 2
};

// Format price to PHP (direct display - no conversion)
function formatPrice(phpPrice) {
    // phpPrice is already in PHP, just format it with thousand separators
    return `${CURRENCY_CONFIG.symbol}${parseFloat(phpPrice).toFixed(CURRENCY_CONFIG.decimalPlaces).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

// Format price with text (for labels)
function formatPriceWithCode(phpPrice) {
    return `${formatPrice(phpPrice)} ${CURRENCY_CONFIG.code}`;
}

// Get PHP price value only (for calculations) - returns the price as-is
function getPHPPrice(phpPrice) {
    return parseFloat(phpPrice);
}
