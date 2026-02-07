// ==================== DOM Elements ====================
const container = document.getElementById("guesthouse-container");
const searchInput = document.getElementById("search");
const viewMoreBtn = document.getElementById("view-more-btn");
const photoModal = document.getElementById("photo-modal");
const roomModal = document.getElementById("room-modal");
const slider = document.getElementById("modal-slider");
const countDisplay = document.getElementById("photo-count");
const mTitle = document.getElementById("modal-title");
const mLocation = document.getElementById("modal-location");
const mPrice = document.getElementById("modal-price");
const mAmenities = document.getElementById("modal-amenities");
const mButtons = document.getElementById("modal-buttons");
const swipeContainer = document.getElementById("swipe-container");
const stayCount = document.getElementById("stay-count");
const amenityCount = document.getElementById("amenity-count");
const filterChips = document.querySelectorAll(".filter-chip");
const modalLocationText = document.getElementById("modal-location-text");

// ==================== Amenity Icons ====================
const amenityIcons = {
  "WiFi": '<i class="fas fa-wifi"></i>',
  "Swimming Pool": '<i class="fas fa-water"></i>',
  "Pool": '<i class="fas fa-water"></i>',
  "TV": '<i class="fas fa-tv"></i>',
  "DStv": '<i class="fas fa-satellite"></i>',
  "Breakfast": '<i class="fas fa-utensils"></i>',
  "Security": '<i class="fas fa-shield-alt"></i>',
  "Victoria Falls Transfers": '<i class="fas fa-car"></i>'
};

// ==================== Location SVG Icon ====================
const locationIcon = `
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12c0 5.5 3.5 10.2 8 12 .5.1 1 .1 1.5 0 4.5-1.8 8-6.5 8-12 0-5.52-4.48-10-10-10zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/>
  </svg>
`;

// ==================== Initialization ====================
window.addEventListener('load', () => {
  if (typeof guesthouses !== 'undefined') {
    allGuesthouses = [...guesthouses];
    filteredGuesthouses = [...guesthouses];
    loadFavoritesFromStorage();
    bindQuickFilters();
    updateStats();
    renderInitialGuesthouses();
    updateViewMoreButton();
  } else {
    console.error("Guesthouses data not loaded!");
  }
});

// ==================== Render Functions ====================
function renderInitialGuesthouses() {
  container.innerHTML = "";
  displayedCount = 0;
  renderMoreGuesthouses();
}

function renderMoreGuesthouses() {
  const startIndex = displayedCount;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredGuesthouses.length);

  for (let i = startIndex; i < endIndex; i++) {
    const g = filteredGuesthouses[i];
    const card = createGuestCard(g);
    container.appendChild(card);
    displayedCount++;
  }

  updateViewMoreButton();
}

function createGuestCard(g) {
  const card = document.createElement("div");
  card.className = "card";
  
  const isFavorited = localStorage.getItem(`fav-${g.id}`) === 'true';
  const favoriteCount = localStorage.getItem(`fav-count-${g.id}`) || '0';
  const fallbackImage = getFallbackImage(g.name);

  card.innerHTML = `
    <img src="${g.images[0]}" alt="${g.name}" loading="lazy" onerror="handleImageError(this, '${fallbackImage}')">
    <div class="card-body">
      <div class="card-header">
        <h3>${g.name}</h3>
        <button class="favorite-btn ${isFavorited ? 'active' : ''}" onclick="toggleFavorite('${g.id}', this)">
          ${isFavorited ? '★' : '☆'}
        </button>
      </div>
      <div class="location-info">
        ${locationIcon}
        <span class="location-text">${g.location}</span>
      </div>
      <div class="favorite-count ${favoriteCount > 0 ? 'show' : ''}" id="fav-count-${g.id}">
        ❤️ ${favoriteCount} people favorited
      </div>
      <button class="explore-btn" onclick="openFullModal('${g.id}')">Explore Guesthouse</button>
    </div>
  `;

  return card;
}

function updateViewMoreButton() {
  if (displayedCount < filteredGuesthouses.length) {
    viewMoreBtn.classList.add('show');
  } else {
    viewMoreBtn.classList.remove('show');
  }
}

// ==================== Modal Functions ====================
function openFullModal(id) {
  currentGuesthouse = guesthouses.find(g => g.id === id);
  if (!currentGuesthouse) return;

  currentImgIndex = 0;
  selectedRoom = null;

  // Populate Details
  mTitle.textContent = currentGuesthouse.name;
  modalLocationText.textContent = currentGuesthouse.location;
  
  const roomPrice = currentGuesthouse.rooms[0] ? currentGuesthouse.rooms[0].price : "N/A";
  mPrice.textContent = `Starting from P ${roomPrice} / night`;

  // Amenities with Icons
  mAmenities.innerHTML = "";
  currentGuesthouse.amenities.forEach(am => {
    const span = document.createElement("span");
    const icon = amenityIcons[am] || '<i class="fas fa-check-circle"></i>';
    span.innerHTML = `${icon} ${am}`;
    mAmenities.appendChild(span);
  });

  // Action Buttons
  mButtons.innerHTML = `
    <button class="btn-book" onclick="openRoomModal()">Book Now</button>
    <a href="tel:+${currentGuesthouse.phone}" class="btn-call">📞 Call Now</a>
  `;

  photoModal.classList.add('show');
  updateSlider();
}

function closePhotoModal() {
  photoModal.classList.remove('show');
}

function openRoomModal() {
  if (currentGuesthouse.rooms.length === 1) {
    // Auto-select if only one room
    selectedRoom = currentGuesthouse.rooms[0];
    proceedToBooking();
    return;
  }

  const roomOptionsDiv = document.getElementById('room-options');
  roomOptionsDiv.innerHTML = '';

  currentGuesthouse.rooms.forEach((room, index) => {
    const roomDiv = document.createElement('div');
    roomDiv.className = 'room-option';
    roomDiv.innerHTML = `
      <div>
        <h4>${room.name}</h4>
        <p>Select to book this room type</p>
      </div>
      <div class="room-price">P ${room.price}</div>
    `;
    
    roomDiv.onclick = () => {
      document.querySelectorAll('.room-option').forEach(r => r.classList.remove('selected'));
      roomDiv.classList.add('selected');
      selectedRoom = room;
    };

    roomOptionsDiv.appendChild(roomDiv);
  });

  const confirmBtn = document.createElement('button');
  confirmBtn.className = 'room-confirm-btn';
  confirmBtn.textContent = 'Confirm Room Selection';
  confirmBtn.onclick = proceedToBooking;
  roomOptionsDiv.parentElement.appendChild(confirmBtn);

  roomModal.classList.add('show');
}

function closeRoomModal() {
  roomModal.classList.remove('show');
}

function proceedToBooking() {
  if (!selectedRoom) {
    alert('Please select a room');
    return;
  }

  const message = `Hello, I saw your guest house listing on Accolink and I would like to make a booking. I'm interested in the ${selectedRoom.name} at P ${selectedRoom.price}/night.`;
  const whatsappUrl = `https://wa.me/${currentGuesthouse.phone}?text=${encodeURIComponent(message)}`;
  
  closeRoomModal();
  window.open(whatsappUrl, '_blank');
}

// ==================== Image Slider with Swipe ====================
function updateSlider() {
  const images = currentGuesthouse.images;
  const fallbackImage = getFallbackImage(currentGuesthouse.name);
  slider.innerHTML = `<img src="${images[currentImgIndex]}" onerror="handleImageError(this, '${fallbackImage}')" />`;
  countDisplay.textContent = `${currentImgIndex + 1} / ${images.length}`;
}

// Swipe Detection
swipeContainer.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
}, false);

swipeContainer.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}, false);

function handleSwipe() {
  if (!currentGuesthouse) return;

  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // Swiped left - next image
      currentImgIndex = (currentImgIndex + 1) % currentGuesthouse.images.length;
    } else {
      // Swiped right - previous image
      currentImgIndex = (currentImgIndex - 1 + currentGuesthouse.images.length) % currentGuesthouse.images.length;
    }
    updateSlider();
  }
}

// Close Modal on Outside Click
window.onclick = (e) => {
  if (e.target === photoModal) {
    closePhotoModal();
  }
  if (e.target === roomModal) {
    closeRoomModal();
  }
};

// ==================== Favorites System ====================
function toggleFavorite(id, btn) {
  event.stopPropagation();
  
  const isFavorited = localStorage.getItem(`fav-${id}`) === 'true';
  const countKey = `fav-count-${id}`;
  let count = parseInt(localStorage.getItem(countKey) || '0');

  if (isFavorited) {
    localStorage.setItem(`fav-${id}`, 'false');
    count = Math.max(0, count - 1);
    btn.textContent = '☆';
    btn.classList.remove('active');
  } else {
    localStorage.setItem(`fav-${id}`, 'true');
    count++;
    btn.textContent = '★';
    btn.classList.add('active');
  }

  localStorage.setItem(countKey, count.toString());

  // Update count display
  const countDisplay = document.getElementById(`fav-count-${id}`);
  if (count > 0) {
    countDisplay.textContent = `❤️ ${count} people favorited`;
    countDisplay.classList.add('show');
  } else {
    countDisplay.classList.remove('show');
  }
}

function loadFavoritesFromStorage() {
  allGuesthouses.forEach(g => {
    const isFavorited = localStorage.getItem(`fav-${g.id}`) === 'true';
    if (!isFavorited) {
      localStorage.setItem(`fav-${g.id}`, 'false');
    }
  });
}

// ==================== Search Filter ====================
searchInput.addEventListener("input", e => {
  applyFilters();
});

// ==================== View More Button ====================
viewMoreBtn.addEventListener('click', () => {
  renderMoreGuesthouses();
  // Smooth scroll
  setTimeout(() => {
    container.lastChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
});

function bindQuickFilters() {
  filterChips.forEach(chip => {
    chip.addEventListener("click", () => {
      const filter = chip.dataset.filter;
      if (filter === "all") {
        filterChips.forEach(btn => btn.classList.remove("active"));
      } else {
        chip.classList.toggle("active");
        document.querySelector('.filter-chip.clear')?.classList.remove("active");
      }
      applyFilters();
    });
  });
}

function applyFilters() {
  const term = searchInput.value.toLowerCase();
  const activeFilters = [...filterChips]
    .filter(chip => chip.classList.contains("active"))
    .map(chip => chip.dataset.filter);

  filteredGuesthouses = allGuesthouses.filter(g => {
    const matchesSearch = term === "" || (
      g.name.toLowerCase().includes(term) ||
      g.location.toLowerCase().includes(term) ||
      g.amenities.some(a => a.toLowerCase().includes(term))
    );

    const matchesFilter = activeFilters.length === 0 || activeFilters.every(filter =>
      g.amenities.includes(filter)
    );

    return matchesSearch && matchesFilter;
  });

  updateStats();
  renderInitialGuesthouses();
}

function updateStats() {
  if (!stayCount || !amenityCount) return;
  stayCount.textContent = filteredGuesthouses.length.toString();
  const amenitySet = new Set();
  filteredGuesthouses.forEach(g => g.amenities.forEach(a => amenitySet.add(a)));
  amenityCount.textContent = amenitySet.size.toString();
}

function getFallbackImage(name) {
  return `https://placehold.co/800x600/1A4D2E/FFFFFF?text=${encodeURIComponent(name)}`;
}

function handleImageError(img, fallbackSrc) {
  if (img.dataset.fallbackLoaded) return;
  img.src = fallbackSrc;
  img.dataset.fallbackLoaded = "true";
  img.classList.add("image-fallback");
}
main.js
