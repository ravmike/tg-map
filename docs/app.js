// Initialize the map and set its view to a default location and zoom level
var map = L.map('map').setView([20, 0], 2);

// Add OpenStreetMap tiles to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);

// Hardcoded locations array
var locations = [
  {
    name: 'Eiffel Tower',
    coords: [48.8584, 2.2945],
    description: 'An iconic symbol of Paris, France.',
  },
  {
    name: 'Statue of Liberty',
    coords: [40.6892, -74.0445],
    description: 'A gift from France to the USA, located in New York City.',
  },
  {
    name: 'Great Wall of China',
    coords: [40.4319, 116.5704],
    description: 'A historic series of walls and fortifications.',
  },
];

// Loop through the locations and add markers to the map
locations.forEach(function (location) {
  L.marker(location.coords)
    .addTo(map)
    .bindPopup(`<b>${location.name}</b><br>${location.description}`);
});

// Function to add user's location dynamically
function addUserLocation() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        // Custom icon for user's location (optional)
        var userIcon = L.icon({
          iconUrl: 'https://cdn-icons-png.flaticon.com/512/25/25694.png', // Example icon URL
          iconSize: [30, 30],
          iconAnchor: [15, 30],
        });

        // Add a marker for the user's location
        L.marker([latitude, longitude], { icon: userIcon })
          .addTo(map)
          .bindPopup('<b>Your Location</b>');

        // Center the map on the user's location
        map.setView([latitude, longitude], 13);
      },
      function (error) {
        console.error('Error obtaining location:', error);
        alert('Unable to retrieve your location.');
      }
    );
  } else {
    alert('Geolocation is not supported by your browser.');
  }
}

// Call the function to add user's location
addUserLocation();

// Fit the map view to show all markers (optional)
var allMarkers = locations.map(function (location) {
  return L.marker(location.coords);
});

var group = L.featureGroup(allMarkers);
map.fitBounds(group.getBounds().pad(0.5));