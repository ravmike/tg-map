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

// Fit the map view to the markers
var group = new L.featureGroup(
  locations.map(function (location) {
    return L.marker(location.coords);
  })
);
map.fitBounds(group.getBounds().pad(0.5));