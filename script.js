// script.js

const API_URL = 'http://localhost:3000';

// DOM Elements
const searchForm = document.getElementById('search-form');
const hotelsContainer = document.getElementById('hotels-container');
const favoritesList = document.getElementById('favorites-list');
const locationInput = document.getElementById('location');

// Event Listeners
searchForm.addEventListener('submit', handleSearch);
document.addEventListener('DOMContentLoaded', initializeApp);

// Hotel Images
const hotelImages = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1332&q=80",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=749&q=80"
];

// Functions
async function initializeApp() {
    await loadLocations();
    await renderFavorites();
}

async function loadLocations() {
    const locations = await fetchLocations();
    const datalist = document.createElement('datalist');
    datalist.id = 'locations-list';
    locations.forEach(location => {
        const option = document.createElement('option');
        option.value = location;
        datalist.appendChild(option);
    });
    locationInput.setAttribute('list', 'locations-list');
    locationInput.parentNode.insertBefore(datalist, locationInput.nextSibling);
}

async function fetchLocations() {
    try {
        const response = await fetch(`${API_URL}/locations`);
        const locations = await response.json();
        return locations.map(location => location.name);
    } catch (error) {
        console.error('Error fetching locations:', error);
        return [];
    }
}

async function handleSearch(e) {
    e.preventDefault();
    const location = locationInput.value;
    const checkIn = document.getElementById('check-in').value;
    const checkOut = document.getElementById('check-out').value;
    const guests = document.getElementById('guests').value;

    const hotels = await fetchHotels(location);
    renderHotels(hotels);
}

async function fetchHotels(location) {
    try {
        const response = await fetch(`${API_URL}/hotels?location=${location}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching hotels:', error);
        return [];
    }
}

function renderHotels(hotels) {
    hotelsContainer.innerHTML = '';
    if (hotels.length === 0) {
        hotelsContainer.innerHTML = '<p>No hotels found. Try a different location.</p>';
        return;
    }
    hotels.forEach((hotel, index) => {
        const hotelCard = createHotelCard(hotel, index);
        hotelsContainer.appendChild(hotelCard);
    });
}

function createHotelCard(hotel, index) {
    const card = document.createElement('div');
    card.classList.add('hotel-card');
    card.innerHTML = `
        <img src="${hotelImages[index % hotelImages.length]}" alt="${hotel.name}">
        <h3>${hotel.name}</h3>
        <p>Location: ${hotel.location}</p>
        <p>Price: $${hotel.price}/night</p>
        <p>Rating: ${hotel.rating}/5</p>
        <button class="favorite-btn" data-id="${hotel.id}">
            ${isFavorite(hotel.id) ? 'Remove from Favorites' : 'Add to Favorites'}
        </button>
    `;
    card.querySelector('.favorite-btn').addEventListener('click', toggleFavorite);
    return card;
}

async function toggleFavorite(e) {
    const hotelId = parseInt(e.target.dataset.id);
    const userId = 1; // Assuming user with ID 1 is logged in
    let user = await fetchUser(userId);
    
    if (isFavorite(hotelId)) {
        user.favorites = user.favorites.filter(id => id !== hotelId);
        e.target.textContent = 'Add to Favorites';
    } else {
        user.favorites.push(hotelId);
        e.target.textContent = 'Remove from Favorites';
    }
    
    await updateUser(user);
    renderFavorites();
}

function isFavorite(hotelId) {
    const user = JSON.parse(localStorage.getItem('user'));
    return user && user.favorites.includes(hotelId);
}

async function fetchUser(userId) {
    try {
        const response = await fetch(`${API_URL}/users/${userId}`);
        const user = await response.json();
        localStorage.setItem('user', JSON.stringify(user));
        return user;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}

async function updateUser(user) {
    try {
        await fetch(`${API_URL}/users/${user.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });
        localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
        console.error('Error updating user:', error);
    }
}

async function renderFavorites() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    favoritesList.innerHTML = '';
    for (const hotelId of user.favorites) {
        const hotel = await fetchHotel(hotelId);
        if (hotel) {
            const li = document.createElement('li');
            li.textContent = hotel.name;
            favoritesList.appendChild(li);
        }
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

// Initialize the app
initializeApp();