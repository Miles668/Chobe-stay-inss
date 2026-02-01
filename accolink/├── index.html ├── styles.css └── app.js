<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accolink - Guest House Booking Platform</title>
    
    <!-- Swiper CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
    
    <!-- Font Awesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    
    <!-- Custom CSS -->
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- Navigation Bar -->
    <nav class="navbar">
        <div class="nav-container">
            <div class="logo">
                <i class="fas fa-home"></i>
                <span>Accolink</span>
            </div>
            <div class="nav-search-wrapper">
                <input 
                    type="text" 
                    id="property_search" 
                    class="search-input" 
                    placeholder="Search by name or location..."
                >
                <i class="fas fa-search search-icon"></i>
            </div>
            <div class="nav-links">
                <a href="#" class="nav-link">Favorites</a>
                <a href="#" class="nav-link">My Bookings</a>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
        <div class="hero-content">
            <h1>Find Your Perfect Guest House</h1>
            <p>Discover comfortable, affordable accommodations for your next getaway</p>
        </div>
    </section>

    <!-- Filters Section -->
    <section class="filters-section">
        <div class="filters-container">
            <div class="filter-group">
                <label for="min-price">Min Price:</label>
                <input type="number" id="min-price" placeholder="0">
            </div>
            <div class="filter-group">
                <label for="max-price">Max Price:</label>
                <input type="number" id="max-price" placeholder="10000">
            </div>
            <div class="filter-group">
                <label for="min-stars">Min Stars:</label>
                <select id="min-stars">
                    <option value="0">All</option>
                    <option value="3">3★+</option>
                    <option value="4">4★+</option>
                    <option value="5">5★</option>
                </select>
            </div>
            <button class="reset-btn" id="reset-filters">Reset Filters</button>
        </div>
    </section>

    <!-- Loading Spinner -->
    <div id="loading-spinner" class="loading-spinner">
        <div class="spinner"></div>
        <p>Loading properties...</p>
    </div>

    <!-- Empty State -->
    <div id="empty-state" class="empty-state" style="display: none;">
        <i class="fas fa-search"></i>
        <h2>No Properties Found</h2>
        <p>Try adjusting your search or filter criteria</p>
    </div>

    <!-- Properties Grid -->
    <section class="properties-section">
        <div class="properties-container" id="properties-grid">
            <!-- Cards will be generated here by JavaScript -->
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="footer-content">
            <p>&copy; 2026 Accolink. All rights reserved. | Premium Guest House Booking Platform</p>
            <div class="footer-links">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Contact Us</a>
            </div>
        </div>
    </footer>

    <!-- Supabase JS Client -->
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    
    <!-- Swiper JS -->
    <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
    
    <!-- Custom JavaScript -->
    <script src="app.js"></script>
</body>
</html>
/* ===== CSS Reset & Base Styles ===== */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary-color: #10b981;
    --primary-dark: #059669;
    --primary-darker: #047857;
    --secondary-color: #1f2937;
    --light-bg: #f3f4f6;
    --white: #ffffff;
    --text-dark: #1f2937;
    --text-light: #6b7280;
    --border-color: #e5e7eb;
    --shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    --shadow-hover: 0 20px 40px rgba(16, 185, 129, 0.2);
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: var(--light-bg);
    color: var(--text-dark);
    line-height: 1.6;
    overflow-x: hidden;
}

html {
    scroll-behavior: smooth;
}

/* ===== Navigation Bar ===== */
.navbar {
    background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-darker) 100%);
    padding: 1rem 0;
    position: sticky;
    top: 0;
    z-index: 1000;
    box-shadow: var(--shadow);
}

.nav-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
    flex-wrap: wrap;
}

.logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--white);
    text-decoration: none;
}

.logo i {
    font-size: 2rem;
}

.nav-search-wrapper {
    flex: 1;
    min-width: 250px;
    position: relative;
}

.search-input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: none;
    border-radius: 25px;
    background: rgba(255, 255, 255, 0.2);
    color: var(--white);
    font-size: 0.9rem;
    transition: all 0.3s ease;
}

.search-input::placeholder {
    color: rgba(255, 255, 255, 0.7);
}

.search-input:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}

.search-icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255, 255, 255, 0.7);
    pointer-events: none;
}

.nav-links {
    display: flex;
    gap: 1.5rem;
}

.nav-link {
    color: var(--white);
    text-decoration: none;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    position: relative;
}

.nav-link::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--white);
    transition: width 0.3s ease;
}

.nav-link:hover::after {
    width: 100%;
}

/* ===== Hero Section ===== */
.hero {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
    color: var(--white);
    padding: 4rem 2rem;
    text-align: center;
    animation: slideDown 0.6s ease-out;
}

.hero-content h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    font-weight: 700;
}

.hero-content p {
    font-size: 1.2rem;
    opacity: 0.95;
    max-width: 600px;
    margin: 0 auto;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* ===== Filters Section ===== */
.filters-section {
    background: var(--white);
    padding: 2rem;
    margin: 2rem 0;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.filters-container {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    align-items: flex-end;
}

.filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 150px;
}

.filter-group label {
    font-weight: 600;
    color: var(--text-dark);
    font-size: 0.9rem;
}

.filter-group input,
.filter-group select {
    padding: 0.75rem;
    border: 2px solid var(--border-color);
    border-radius: 8px;
    font-size: 0.9rem;
    transition: all 0.3s ease;
}

.filter-group input:focus,
.filter-group select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.reset-btn {
    padding: 0.75rem 1.5rem;
    background: var(--primary-color);
    color: var(--white);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
}

.reset-btn:hover {
    background: var(--primary-dark);
    transform: translateY(-2px);
}

/* ===== Loading Spinner ===== */
.loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    gap: 1rem;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 5px solid var(--border-color);
    border-top-color: var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

/* ===== Empty State ===== */
.empty-state {
    text-align: center;
    padding: 4rem 2rem;
    color: var(--text-light);
}

.empty-state i {
    font-size: 4rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
    opacity: 0.5;
}

.empty-state h2 {
    margin-bottom: 0.5rem;
    color: var(--text-dark);
}

/* ===== Properties Section ===== */
.properties-section {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
}

.properties-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 2rem;
    animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

/* ===== Property Card ===== */
.property-card {
    background: var(--white);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: var(--shadow);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    display: flex;
    flex-direction: column;
}

.property-card:hover {
    transform: translateY(-10px);
    box-shadow: var(--shadow-hover);
}

/* Image Gallery with Swiper */
.property-image-wrapper {
    position: relative;
    width: 100%;
    height: 250px;
    overflow: hidden;
    background: var(--light-bg);
}

.swiper {
    width: 100%;
    height: 100%;
}

.swiper-slide {
    display: flex;
    align-items: center;
    justify-content: center;
}

.swiper-slide img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.property-card:hover .swiper-slide img {
    transform: scale(1.05);
}

.image-count {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.7);
    color: var(--white);
    padding: 0.5rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    z-index: 10;
}

/* Rating Badge */
.rating-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    background: var(--primary-color);
    color: var(--white);
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    z-index: 10;
}

.rating-badge i {
    font-size: 0.75rem;
}

/* Card Content */
.property-content {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    flex: 1;
}

.property-header {
    margin-bottom: 0.75rem;
}

.property-name {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--text-dark);
    margin-bottom: 0.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.property-location {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-light);
    font-size: 0.9rem;
}

.property-location i {
    color: var(--primary-color);
}

/* Price Section */
.property-price {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary-color);
    margin: 1rem 0;
}

.property-price span {
    font-size: 0.85rem;
    color: var(--text-light);
    font-weight: 500;
}

/* Amenities */
.amenities-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin: 1rem 0;
}

.amenity-badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(16, 185, 129, 0.1);
    color: var(--primary-color);
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 600;
}

.amenity-badge i {
    font-size: 0.9rem;
}

/* Analytics Stats */
.card-stats {
    display: flex;
    gap: 1rem;
    margin: 1rem 0;
    padding: 0.75rem 0;
    border-top: 1px solid var(--border-color);
    border-bottom: 1px solid var(--border-color);
    font-size: 0.8rem;
    color: var(--text-light);
}

.stat {
    display: flex;
    align-items: center;
    gap: 0.3rem;
}

/* Book Now Button */
.book-btn {
    margin-top: auto;
    padding: 0.85rem;
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
    color: var(--white);
    border: none;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.book-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
}

.book-btn:active {
    transform: translateY(0);
}

/* ===== Footer ===== */
.footer {
    background: linear-gradient(135deg, var(--secondary-color), var(--text-dark));
    color: var(--white);
    padding: 2rem;
    margin-top: 4rem;
    text-align: center;
}

.footer-content {
    max-width: 1400px;
    margin: 0 auto;
}

.footer-links {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 1rem;
    flex-wrap: wrap;
}

.footer-links a {
    color: var(--white);
    text-decoration: none;
    transition: all 0.3s ease;
}

.footer-links a:hover {
    color: var(--primary-color);
}

/* ===== Responsive Design ===== */
@media (max-width: 768px) {
    .nav-container {
        flex-direction: column;
        gap: 1rem;
    }

    .nav-search-wrapper {
        min-width: 100%;
    }

    .nav-links {
        width: 100%;
        justify-content: center;
    }

    .hero-content h1 {
        font-size: 2rem;
    }

    .filters-container {
        flex-direction: column;
    }

    .filter-group {
        min-width: 100%;
    }

    .properties-container {
        grid-template-columns: 1fr;
    }

    .property-image-wrapper {
        height: 280px;
    }
}

@media (max-width: 480px) {
    .hero-content h1 {
        font-size: 1.5rem;
    }

    .hero-content p {
        font-size: 0.95rem;
    }

    .property-name {
        font-size: 1rem;
    }

    .property-price {
        font-size: 1.2rem;
    }

    .amenities-list {
        gap: 0.5rem;
    }

    .amenity-badge {
        font-size: 0.75rem;
        padding: 0.4rem 0.6rem;
    }
}

/* ===== Scrollbar Styling ===== */
::-webkit-scrollbar {
    width: 10px;
}

::-webkit-scrollbar-track {
    background: var(--light-bg);
}

::-webkit-scrollbar-thumb {
    background: var(--primary-color);
    border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
    background: var(--primary-dark);
}

/* ===== Swiper Customization ===== */
.swiper-button-next,
.swiper-button-prev {
    color: var(--white);
    background: rgba(0, 0, 0, 0.4);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    transition: all 0.3s ease;
}

.swiper-button-next:after,
.swiper-button-prev:after {
    font-size: 1rem;
}

.swiper-button-next:hover,
.swiper-button-prev:hover {
    background: rgba(0, 0, 0, 0.7);
}

.swiper-pagination-bullet {
    background: rgba(255, 255, 255, 0.5);
}

.swiper-pagination-bullet-active {
    background: var(--primary-color);
}
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
