// ===== DATA CENTER (Add New Guest Houses Here) =====
const guestHouses = [
    {
        id: "pumpkinheads-01",
        name: "Punkinheads Guesthouse",
        location: "Kasane Plateau",
        price: 800,
        whatsapp: "26774938278",
        stars: 4,
        hearts: 124, // Initial heart count
        images: [
            "https://vmctxpfqlwqhcdwiqkpg.supabase.co/storage/v1/object/public/property-images/WhatsApp%20Image%202026-01-31%20at%2018.17.52%20(1).jpeg",
            "https://vmctxpfqlwqhcdwiqkpg.supabase.co/storage/v1/object/public/property-images/15df0959-851e-4b0a-9d72-97a3a94aaf95.jpg",
            "https://vmctxpfqlwqhcdwiqkpg.supabase.co/storage/v1/object/public/property-images/29213951-bfc1-41e9-8cdf-44361402b58b.jpg",
            "https://vmctxpfqlwqhcdwiqkpg.supabase.co/storage/v1/object/public/property-images/cf27f7af-431e-4aa1-88a7-5e8e426a99d7.jpg"
        ],
        amenities: ["WiFi", "TV", "Breakfast", "Security"]
    }
    // To add more, put a comma here and paste another block
];

// ===== AMENITY ICONS =====
const iconMap = {
    "wifi": "fa-wifi",
    "tv": "fa-tv",
    "breakfast": "fa-coffee",
    "security": "fa-shield-halved"
};

// ===== RENDER FUNCTION =====
function displayGuestHouses(data) {
    const grid = document.getElementById('properties-grid');
    grid.innerHTML = data.map(house => {
        
        const slides = house.images.map(img => `
            <div class="swiper-slide"><img src="${img}" alt="${house.name}"></div>
        `).join('');

        const amenitiesHTML = house.amenities.map(a => `
            <div class="amenity-badge">
                <i class="fas ${iconMap[a.toLowerCase()] || 'fa-check'}"></i>
                <span>${a}</span>
            </div>
        `).join('');

        return `
            <div class="property-card">
                <div class="property-image-wrapper">
                    <div class="rating-badge"><i class="fas fa-star"></i> ${house.stars}</div>
                    <div class="heart-container" onclick="handleHeart('${house.id}')">
                        <i class="far fa-heart" id="heart-icon-${house.id}"></i>
                        <span id="heart-count-${house.id}">${house.hearts}</span>
                    </div>
                    <div class="swiper swiper-${house.id}">
                        <div class="swiper-wrapper">${slides}</div>
                        <div class="swiper-pagination"></div>
                    </div>
                </div>
                <div class="property-content">
                    <h3 class="property-name">${house.name}</h3>
                    <div class="property-location"><i class="fas fa-map-marker-alt"></i> ${house.location}</div>
                    <div class="property-price">P${house.price} <span>/ night</span></div>
                    <div class="amenities-list">${amenitiesHTML}</div>
                    <button class="book-btn" onclick="bookNow('${house.name}', '${house.whatsapp}')">
                        <i class="fab fa-whatsapp"></i> Book via WhatsApp
                    </button>
                </div>
            </div>
        `;
    }).join('');

    // Start Sliders
    data.forEach(house => {
        new Swiper(`.swiper-${house.id}`, {
            pagination: { el: '.swiper-pagination', clickable: true },
            loop: true
        });
    });
}

// ===== FUNCTIONALITY =====
function bookNow(name, phone) {
    const message = encodeURIComponent(`Hello! I saw your guest house "${name}" on Accolink. Any rooms available?`);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
}

function handleHeart(id) {
    const icon = document.getElementById(`heart-icon-${id}`);
    const countEl = document.getElementById(`heart-count-${id}`);
    let count = parseInt(countEl.innerText);

    if (icon.classList.contains('far')) {
        icon.classList.replace('far', 'fas');
        icon.style.color = '#e11d48'; // Red heart
        countEl.innerText = count + 1;
    } else {
        icon.classList.replace('fas', 'far');
        icon.style.color = 'white';
        countEl.innerText = count - 1;
    }
}

// Search Filter
document.getElementById('property_search').addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase();
    const filtered = guestHouses.filter(h => 
        h.name.toLowerCase().includes(val) || h.location.toLowerCase().includes(val)
    );
    displayGuestHouses(filtered);
});

// Initial Load
displayGuestHouses(guestHouses);
