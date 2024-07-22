# Hotel Booking App

## Description

The Hotel Booking App is a single-page application (SPA) that allows users to search for hotels, view hotel details, and manage their favorite hotels. This project demonstrates the use of vanilla JavaScript to create a dynamic web application with CRUD (Create, Read, Update, Delete) functionality and JSON-server as a mock backend.

## Features

- Search for hotels by location
- View a list of hotels with real images
- See detailed information about each hotel
- Add and remove hotels from favorites
- Persist user favorites using JSON-server

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- JSON-server for mock API

## Installation

1. Clone the repository:
git clone https://github.com/majak24/hotel-booking-app.git
Copy
2. Navigate to the project directory:
cd hotel-booking-app
Copy
3. Install JSON-server globally (if not already installed):
npm install -g json-server
Copy
4. Start the JSON-server:
json-server --watch db.json
Copy
5. Open the `index.html` file in your web browser or use a local server to run the application.

## Usage

1. Enter a location in the search bar and click 'Search' or press Enter.
2. Browse through the list of hotels displayed.
3. Click on the 'Add to Favorites' button to save a hotel to your favorites.
4. View your favorite hotels in the 'Your Favorites' section.
5. Click 'Remove from Favorites' to remove a hotel from your favorites list.

## Project Structure
PHASE1-PROJECT/
│
├── index.html
├── style.css
├── script.js
├── db.json
└── README.md
Copy
- `index.html`: The main HTML file that structures the app
- `styles.css`: Contains all the styles for the application
- `app.js`: The JavaScript file that handles all the functionality
- `db.json`: The JSON file that serves as a mock database for the application

## API Endpoints

The following endpoints are available when running the JSON-server:

- GET `/hotels`: Fetch all hotels
- GET `/hotels?location=:location`: Fetch hotels by location
- GET `/hotels/:id`: Fetch a specific hotel by ID
- GET `/users`: Fetch all users
- GET `/users/:id`: Fetch a specific user by ID
- PUT `/users/:id`: Update a user's information (used for updating favorites)

## Contributing

Contributions to improve the Hotel Booking App are welcome. Please follow these steps to contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- Hotel images provided by [Unsplash](https://unsplash.com/)
- JSON-server for providing an easy-to-use mock backend

## Contact

Majak Deng - majakbanks.deng@icloud.com

Project Link: [https://github.com/majak24/hotel-booking-app](https://github.com/your-username/hotel-booking-app)
This README provides:

1. A brief description of the project
2. Key features
3. Technologies used
4. Installation and usage instructions
5. Project structure
6. API endpoint information
7. Contribution guidelines
8. License information
9. Acknowledgments
10. Contact information

