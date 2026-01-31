// Currency Utility for PHP Conversion
// Exchange rate can be adjusted as needed
const CURRENCY_CONFIG = {
    symbol: '₱',
    code: 'PHP',
    // Conversion rate from USD to PHP (approximately 1 USD = 56-58 PHP)
    // Using 57 as a reasonable average
    exchangeRate: 57,
    decimalPlaces: 2
};

// Format price to PHP
function formatPrice(priceUSD) {
    const phpPrice = priceUSD * CURRENCY_CONFIG.exchangeRate;
    return `${CURRENCY_CONFIG.symbol}${phpPrice.toFixed(CURRENCY_CONFIG.decimalPlaces).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

// Format price with text (for labels)
function formatPriceWithCode(priceUSD) {
    return `${formatPrice(priceUSD)} ${CURRENCY_CONFIG.code}`;
}

// Get PHP price value only (for calculations)
function getPHPPrice(priceUSD) {
    return priceUSD * CURRENCY_CONFIG.exchangeRate;
}
