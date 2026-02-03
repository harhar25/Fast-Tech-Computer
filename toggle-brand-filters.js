
// Toggle brand filters expand/collapse
function toggleBrandFilters(header) {
    const brandFiltersDiv = document.getElementById('brandFiltersExpand');
    const icon = header.querySelector('i');
    
    if (brandFiltersDiv.style.maxHeight === '0px' || brandFiltersDiv.style.maxHeight === '') {
        // Expand
        brandFiltersDiv.style.maxHeight = '300px';
        icon.style.transform = 'rotate(180deg)';
    } else {
        // Collapse
        brandFiltersDiv.style.maxHeight = '0px';
        icon.style.transform = 'rotate(0deg)';
    }
}
