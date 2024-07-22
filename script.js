const API_URL = 'http://localhost:3000';

// DOM Elements
const searchForm = document.getElementById('search-form');
const hotelsContainer = document.getElementById('hotels-container');
const favoritesList = document.getElementById('favorites-list');
const locationInput = document.getElementById('location');

// Event Listeners
searchForm.addEventListener('submit', handleSearch);
document.addEventListener('DOMContentLoaded', initializeApp);

async function initializeApp() {
    await loadLocations();
    await renderFavorites();
    // Load all hotels initially
    const hotels = await fetchHotels();
    renderHotels(hotels);
}

async function loadLocations() {
    const locations = await fetchLocations();
    const datalist = document.createElement('datalist');
    datalist.id = 'locations-list';
    locations.forEach(location => {
        const option = document.createElement('option');
        option.value = location.name;
        datalist.appendChild(option);
    });
    locationInput.setAttribute('list', 'locations-list');
    locationInput.parentNode.insertBefore(datalist, locationInput.nextSibling);
}

async function fetchLocations() {
    try {
        const response = await fetch(`${API_URL}/locations`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching locations:', error);
        return [];
    }
}

async function handleSearch(e) {
    e.preventDefault();
    const location = locationInput.value;
    const hotels = await fetchHotels(location);
    renderHotels(hotels);
}

async function fetchHotels(location = '') {
    try {
        let url = `${API_URL}/hotels`;
        if (location) {
            const locationObj = await getLocationByName(location);
            if (locationObj) {
                url += `?locationId=${locationObj.id}`;
            }
        }
        const response = await fetch(url);
        const hotels = await response.json();
        console.log('Fetched hotels:', hotels); // Debug log
        return hotels;
    } catch (error) {
        console.error('Error fetching hotels:', error);
        return [];
    }
}

async function getLocationByName(locationName) {
    try {
        const response = await fetch(`${API_URL}/locations?name=${encodeURIComponent(locationName)}`);
        const locations = await response.json();
        return locations[0];
    } catch (error) {
        console.error('Error fetching location:', error);
        return null;
    }
}

async function renderHotels(hotels) {
    hotelsContainer.innerHTML = '';
    if (hotels.length === 0) {
        hotelsContainer.innerHTML = '<p>No hotels found. Try a different location.</p>';
        return;
    }
    for (const hotel of hotels) {
        const hotelCard = await createHotelCard(hotel);
        hotelsContainer.appendChild(hotelCard);
    }
}

async function createHotelCard(hotel) {
    console.log('Creating card for hotel:', hotel);  // Debug log
    const card = document.createElement('div');
    card.classList.add('hotel-card');
    const isFav = await isFavorite(hotel.id);
    card.innerHTML = `
        <img src="${hotel.image}" alt="${hotel.name}" onerror="this.onerror=null; this.src='https://via.placeholder.com/300x200?text=No+Image'; console.log('Image failed to load:', this.src);">
        <div class="hotel-card-content">
            <h3>${hotel.name}</h3>
            <p>Location: ${await getLocationName(hotel.locationId) || 'Unknown'}</p>
            <p>Price: $${hotel.price}/night</p>
            <p>Rating: ${hotel.rating}/5</p>
            <div class="card-buttons">
                <button class="favorite-btn" data-id="${hotel.id}">
                    ${isFav ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
                <button class="book-now-btn" data-id="${hotel.id}">Book Now</button>
            </div>
        </div>
    `;
    card.querySelector('.favorite-btn').addEventListener('click', toggleFavorite);
    card.querySelector('.book-now-btn').addEventListener('click', bookHotel);
    return card;
}

async function getLocationName(locationId) {
    try {
        const response = await fetch(`${API_URL}/locations/${locationId}`);
        const location = await response.json();
        return location.name;
    } catch (error) {
        console.error('Error fetching location:', error);
        return null;
    }
}

async function toggleFavorite(e) {
    const hotelId = e.target.dataset.id;
    const userId = 1; // Assuming user with ID 1 is logged in
    let user = await fetchUser(userId);
    
    if (user.favorites.includes(hotelId)) {
        user.favorites = user.favorites.filter(id => id !== hotelId);
        e.target.textContent = 'Add to Favorites';
    } else {
        user.favorites.push(hotelId);
        e.target.textContent = 'Remove from Favorites';
    }
    
    await updateUser(user);
    await renderFavorites();
}

async function isFavorite(hotelId) {
    const userId = 1; // Assuming user with ID 1 is logged in
    const user = await fetchUser(userId);
    return user.favorites.includes(hotelId);
}

async function fetchUser(userId) {
    try {
        const response = await fetch(`${API_URL}/users/${userId}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}

async function updateUser(user) {
    try {
        const response = await fetch(`${API_URL}/users/${user.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });
        if (!response.ok) {
            throw new Error('Failed to update user on server');
        }
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

async function renderFavorites() {
    const userId = 1; // Assuming user with ID 1 is logged in
    const user = await fetchUser(userId);
    if (!user) return;

    favoritesList.innerHTML = '';
    
    if (user.favorites.length === 0) {
        const li = document.createElement('li');
        li.textContent = "You haven't added any favorites yet.";
        favoritesList.appendChild(li);
        return;
    }

    for (const hotelId of user.favorites) {
        const hotel = await fetchHotel(hotelId);
        if (hotel) {
            const li = document.createElement('li');
            li.innerHTML = `
                ${hotel.name}
                <button class="delete-favorite" data-id="${hotel.id}">Delete</button>
            `;
            li.querySelector('.delete-favorite').addEventListener('click', deleteFavorite);
            favoritesList.appendChild(li);
        }
    }
}

async function deleteFavorite(e) {
    const hotelId = e.target.dataset.id;
    const userId = 1; // Assuming user with ID 1 is logged in
    let user = await fetchUser(userId);
    
    user.favorites = user.favorites.filter(id => id !== hotelId);
    
    await updateUser(user);
    await renderFavorites();

    // Update the "Add to Favorites" button if the hotel is currently displayed
    const favoriteBtn = document.querySelector(`.favorite-btn[data-id="${hotelId}"]`);
    if (favoriteBtn) {
        favoriteBtn.textContent = 'Add to Favorites';
    }
}

async function fetchHotel(hotelId) {
    try {
        const response = await fetch(`${API_URL}/hotels/${hotelId}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching hotel:', error);
        return null;
    }
}

function bookHotel(e) {
    const hotelId = e.target.dataset.id;
    console.log(`Booking hotel with ID: ${hotelId}`);
    alert(`Booking process initiated for hotel ID: ${hotelId}`);
}

// Initialize the app
initializeApp();