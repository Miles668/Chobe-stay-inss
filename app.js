// Add new guest houses here. Just follow the pattern!
const guestHouses = [
    {
        id: "pheads-01",
        name: "Punkinheads Guesthouse",
        location: "Kasane Plateau",
        price: 800,
        whatsapp: "26774938278",
        amenities: ["WiFi", "TV", "Breakfast", "Security"],
        images: [
            "https://vmctxpfqlwqhcdwiqkpg.supabase.co/storage/v1/object/public/property-images/WhatsApp%20Image%202026-01-31%20at%2018.17.52%20(1).jpeg",
            "https://vmctxpfqlwqhcdwiqkpg.supabase.co/storage/v1/object/public/property-images/15df0959-851e-4b0a-9d72-97a3a94aaf95.jpg",
            "https://vmctxpfqlwqhcdwiqkpg.supabase.co/storage/v1/object/public/property-images/29213951-bfc1-41e9-8cdf-44361402b58b.jpg",
            "https://vmctxpfqlwqhcdwiqkpg.supabase.co/storage/v1/object/public/property-images/cf27f7af-431e-4aa1-88a7-5e8e426a99d7.jpg"
        ]
    }
];

function renderStays(data) {
    const grid = document.getElementById('properties-grid');
    grid.innerHTML = data.map(stay => {
        
        const slides = stay.images.map(img => `<div class="swiper-slide"><img src="${img}"></div>`).join('');
        const tags = stay.amenities.map(a => `<span class="amenity">${a}</span>`).join('');

        return `
            <div class="property-card">
                <div class="swiper swiper-${stay.id}">
                    <div class="swiper-wrapper">${slides}</div>
                    <div class="swiper-pagination"></div>
                </div>
                <div class="content">
                    <div class="location"><i class="fas fa-map-marker-alt"></i> ${stay.location}</div>
                    <h2 style="margin: 0.5rem 0; font-size: 1.25rem;">${stay.name}</h2>
                    <div class="price">P${stay.price} <span style="font-size: 0.8rem; color: #94a3b8;">/ night</span></div>
                    <div class="amenities">${tags}</div>
                    <button class="book-btn" onclick="sendWhatsApp('${stay.name}', '${stay.whatsapp}')">
                        <i class="fab fa-whatsapp"></i> Book via WhatsApp
                    </button>
                </div>
            </div>
        `;
    }).join('');

    // Initialize the sliders
    data.forEach(stay => {
        new Swiper(`.swiper-${stay.id}`, {
            pagination: { el: '.swiper-pagination', clickable: true },
            loop: true
        });
    });
}

function sendWhatsApp(name, phone) {
    const message = encodeURIComponent(`Hello! I saw your guest house "${name}" on Accolink. Do you have any rooms available?`);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
}

// Search logic
document.getElementById('property_search').addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase();
    const filtered = guestHouses.filter(h => h.name.toLowerCase().includes(val) || h.location.toLowerCase().includes(val));
    renderStays(filtered);
});

// Load it up!
renderStays(guestHouses);
