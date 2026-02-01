// ===== SUPABASE CONFIGURATION =====
const SUPABASE_URL = 'https://vmctxpfqlwqhcdwiqkpg.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_DKgc7fLhpguRjq_xac86hw_F7MzhEjm';

const { createClient } = window.supabase;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===== DATABASE SCHEMA CONFIGURATION =====
const TABLE_NAME = 'guest_houses';
// Expected table structure:
// - id (UUID, Primary Key)
// - name (VARCHAR)
// - location (VARCHAR)
// - price (INTEGER)
// - stars (DECIMAL/NUMERIC)
// - whatsapp (VARCHAR) - Format: "255712345678" (country code + number, no + symbol)
// - images (JSONB - Array of image URLs: ["url1", "url2", "url3"])
// - amenities (JSONB - Array of amenity names: ["wifi", "pool", "ac", "parking"])
// - views_count (INTEGER, default 0)
// - clicks_count (INTEGER, default 0)
// - created_at (TIMESTAMP)

// ===== STATE MANAGEMENT =====
let allProperties = [];
let filteredProperties = [];
let swiperInstances = new Map();

// ===== DOM ELEMENTS =====
const propertiesGrid = document.getElementById('properties-grid');
const searchInput = document.getElementById('property_search');
const minPriceInput = document.getElementById('min-price');
const maxPriceInput = document.getElementById('max-price');
const minStarsSelect = document.getElementById('min-stars');
const resetFiltersBtn = document.getElementById('reset-filters');
const loadingSpinner = document.getElementById('loading-spinner');
const emptyState = document.getElementById('empty-state');

// ===== AMENITY ICONS MAPPING =====
const amenityIconMap = {
    'wifi': 'fas fa-wifi',
    'pool': 'fas fa-water',
    'ac': 'fas fa-snowflake',
    'parking': 'fas fa-square-parking',
    'kitchen': 'fas fa-kitchen-set',
    'laundry': 'fas fa-shirt',
    'tv': 'fas fa-tv',
    'iron': 'fas fa-iron',
    'microwave': 'fas fa-microwave',
    'refrigerator': 'fas fa-snowflake',
    'dishwasher': 'fas fa-water',
    'heating': 'fas fa-temperature-high',
    'balcony': 'fas fa-door-open',
    'garden': 'fas fa-tree',
    'gym': 'fas fa-dumbbell'
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', async () => {
    await loadProperties();
    setupEventListeners();
});

// ===== FETCH PROPERTIES FROM SUPABASE =====
async function loadProperties() {
    try {
        showLoadingSpinner(true);
        
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*');

        if (error) {
            console.error('Error loading properties:', error);
            showEmptyState(true);
            return;
        }

        if (!data || data.length === 0) {
            showEmptyState(true);
            return;
        }

        allProperties = data;
        filteredProperties = [...allProperties];
        renderProperties();
    } catch (error) {
        console.error('Unexpected error:', error);
        showEmptyState(true);
    } finally {
        showLoadingSpinner(false);
    }
}

// ===== RENDER PROPERTY CARDS =====
function renderProperties() {
    if (filteredProperties.length === 0) {
        showEmptyState(true);
        propertiesGrid.innerHTML = '';
        return;
    }

    showEmptyState(false);
    propertiesGrid.innerHTML = '';

    // Using .map() to generate HTML for each property
    const cardsHTML = filteredProperties.map((property) => {
        return createPropertyCard(property);
    }).join('');

    propertiesGrid.innerHTML = cardsHTML;

    // Initialize Swiper instances for each card
    initializeSwipers();

    // Attach event listeners to buttons
    attachButtonListeners();
}

// ===== CREATE PROPERTY CARD HTML =====
function createPropertyCard(property) {
    const {
        id,
        name,
        location,
        price,
        stars,
        whatsapp,
        images,
        amenities,
        views_count,
        clicks_count
    } = property;

    // Safely parse images array
    const imageArray = Array.isArray(images) ? images : [];
    const imageCount = imageArray.length;

    // Safely parse amenities array
    const amenitiesArray = Array.isArray(amenities) ? amenities : [];

    // Generate amenities HTML
    const amenitiesHTML = amenitiesArray
        .slice(0, 3)
        .map((amenity) => {
            const iconClass = amenityIconMap[amenity.toLowerCase()] || 'fas fa-check';
            return `<div class="amenity-badge">
                <i class="${iconClass}"></i>
                <span>${amenity}</span>
            </div>`;
        })
        .join('');

    // Generate image slides HTML
    const slidesHTML = imageArray
        .map((imageUrl) => {
            return `<div class="swiper-slide">
                <img src="${imageUrl}" alt="${name}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
            </div>`;
        })
        .join('');

    // Return the complete card HTML
    return `
        <div class="property-card" data-property-id="${id}" data-whatsapp="${whatsapp}" data-name="${name}">
            <div class="property-image-wrapper">
                <div class="rating-badge">
                    <i class="fas fa-star"></i>
                    <span>${stars || 0}</span>
                </div>
                
                <div class="swiper property-swiper-${id}">
                    <div class="swiper-wrapper">
                        ${slidesHTML || `<div class="swiper-slide"><img src="https://via.placeholder.com/400x300?text=No+Image" alt="${name}"></div>`}
                    </div>
                    <div class="swiper-button-next"></div>
                    <div class="swiper-button-prev"></div>
                    <div class="swiper-pagination"></div>
                </div>

                ${imageCount > 0 ? `<div class="image-count"><i class="fas fa-image"></i> ${imageCount}</div>` : ''}
            </div>

            <div class="property-content">
                <div class="property-header">
                    <h3 class="property-name">${name}</h3>
                    <div class="property-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${location}</span>
                    </div>
                </div>

                <div class="property-price">
                    $${price}
                    <span>/night</span>
                </div>

                <div class="amenities-list">
                    ${amenitiesHTML}
                </div>

                <div class="card-stats">
                    <div class="stat">
                        <i class="fas fa-eye"></i>
                        <span>${views_count || 0} views</span>
                    </div>
                    <div class="stat">
                        <i class="fas fa-hand-pointer"></i>
                        <span>${clicks_count || 0} interested</span>
                    </div>
                </div>

                <button class="book-btn" data-property-id="${id}" data-whatsapp="${whatsapp}" data-name="${name}">
                    <i class="fab fa-whatsapp"></i>
                    Book Now
                </button>
            </div>
        </div>
    `;
}

// ===== INITIALIZE SWIPERS FOR IMAGE GALLERY =====
function initializeSwipers() {
    filteredProperties.forEach((property) => {
        const swiperContainer = document.querySelector(`.property-swiper-${property.id}`);
        
        if (swiperContainer && !swiperInstances.has(property.id)) {
            const swiper = new Swiper(swiperContainer, {
                loop: true,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false
                },
                pagination: {
                    el: swiperContainer.querySelector('.swiper-pagination'),
                    clickable: true
                },
                navigation: {
                    nextEl: swiperContainer.querySelector('.swiper-button-next'),
                    prevEl: swiperContainer.querySelector('.swiper-button-prev')
                },
                effect: 'fade',
                fadeEffect: {
                    crossFade: true
                }
            });

            swiperInstances.set(property.id, swiper);
        }
    });
}

// ===== ATTACH BUTTON EVENT LISTENERS =====
function attachButtonListeners() {
    const bookButtons = document.querySelectorAll('.book-btn');
    
    bookButtons.forEach((button) => {
        button.addEventListener('click', handleBookNowClick);
    });

    const cards = document.querySelectorAll('.property-card');
    
    cards.forEach((card) => {
        card.addEventListener('mouseenter', () => {
            incrementViewsCount(card.dataset.propertyId);
        });
    });
}

// ===== HANDLE BOOK NOW BUTTON CLICK =====
async function handleBookNowClick(event) {
    event.preventDefault();

    const propertyId = this.dataset.propertyId;
    const whatsappNumber = this.dataset.whatsapp;
    const propertyName = this.dataset.name;

    // Validate WhatsApp number
    if (!whatsappNumber || whatsappNumber.trim() === '') {
        console.error('WhatsApp number not available');
        alert('WhatsApp contact not available for this property.');
        return;
    }

    // Track click analytics
    await incrementClicksCount(propertyId);

    // Create WhatsApp message with pre-filled text
    const message = encodeURIComponent(
        `Hello! I saw your guest house "${propertyName}" on Accolink.com. I'm interested in booking a room.`
    );

    // Format WhatsApp link
    // For international numbers: https://wa.me/{countrycode}{phonenumber}
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;

    // Open WhatsApp in new window
    window.open(whatsappLink, '_blank', 'width=600,height=600');
}

// ===== ANALYTICS: INCREMENT VIEWS COUNT =====
async function incrementViewsCount(propertyId) {
    try {
        const property = allProperties.find(p => p.id === propertyId);
        if (!property) return;

        const newViewsCount = (property.views_count || 0) + 1;

        const { error } = await supabase
            .from(TABLE_NAME)
            .update({ views_count: newViewsCount })
            .eq('id', propertyId);

        if (error) {
            console.error('Error updating views count:', error);
            return;
        }

        // Update local state
        property.views_count = newViewsCount;

        // Update UI
        const card = document.querySelector(`[data-property-id="${propertyId}"]`);
        if (card) {
            const viewsStat = card.querySelector('.stat i.fa-eye').nextElementSibling;
            if (viewsStat) {
                viewsStat.textContent = `${newViewsCount} views`;
            }
        }
    } catch (error) {
        console.error('Unexpected error in incrementViewsCount:', error);
    }
}

// ===== ANALYTICS: INCREMENT CLICKS COUNT =====
async function incrementClicksCount(propertyId) {
    try {
        const property = allProperties.find(p => p.id === propertyId);
        if (!property) return;

        const newClicksCount = (property.clicks_count || 0) + 1;

        const { error } = await supabase
            .from(TABLE_NAME)
            .update({ clicks_count: newClicksCount })
            .eq('id', propertyId);

        if (error) {
            console.error('Error updating clicks count:', error);
            return;
        }

        // Update local state
        property.clicks_count = newClicksCount;

        // Update UI
        const card = document.querySelector(`[data-property-id="${propertyId}"]`);
        if (card) {
            const clicksStat = card.querySelector('.stat i.fa-hand-pointer').nextElementSibling;
            if (clicksStat) {
                clicksStat.textContent = `${newClicksCount} interested`;
            }
        }
    } catch (error) {
        console.error('Unexpected error in incrementClicksCount:', error);
    }
}

// ===== SETUP EVENT LISTENERS =====
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', filterProperties);

    // Filter functionality
    minPriceInput.addEventListener('change', filterProperties);
    maxPriceInput.addEventListener('change', filterProperties);
    minStarsSelect.addEventListener('change', filterProperties);

    // Reset filters
    resetFiltersBtn.addEventListener('click', resetFilters);
}

// ===== FILTER PROPERTIES FUNCTION =====
function filterProperties() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const minPrice = parseInt(minPriceInput.value) || 0;
    const maxPrice = parseInt(maxPriceInput.value) || Infinity;
    const minStars = parseFloat(minStarsSelect.value) || 0;

    filteredProperties = allProperties.filter((property) => {
        const matchesSearch = 
            property.name.toLowerCase().includes(searchTerm) ||
            property.location.toLowerCase().includes(searchTerm);

        const matchesPrice = property.price >= minPrice && property.price <= maxPrice;
        const matchesStars = property.stars >= minStars;

        return matchesSearch && matchesPrice && matchesStars;
    });

    renderProperties();
}

// ===== RESET FILTERS FUNCTION =====
function resetFilters() {
    searchInput.value = '';
    minPriceInput.value = '';
    maxPriceInput.value = '';
    minStarsSelect.value = '0';

    filteredProperties = [...allProperties];
    renderProperties();
}

// ===== SHOW/HIDE LOADING SPINNER =====
function showLoadingSpinner(show) {
    if (show) {
        loadingSpinner.style.display = 'flex';
    } else {
        loadingSpinner.style.display = 'none';
    }
}

// ===== SHOW/HIDE EMPTY STATE =====
function showEmptyState(show) {
    if (show) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
    }
}

// ===== DEBOUNCE FUNCTION FOR SEARCH =====
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// Apply debounce to search for better performance
searchInput.addEventListener('input', debounce(filterProperties, 300));
