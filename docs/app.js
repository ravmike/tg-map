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
  // Create a marker
  var marker = L.marker(location.coords).addTo(map);

  // Create popup content with a "Navigate Here" link
  var popupContent = `
    <b>${location.name}</b><br>${location.description}<br>
    <a href="#" onclick="navigateTo(${location.coords[0]}, ${location.coords[1]}); return false;">Navigate Here</a>
  `;

  // Bind the popup to the marker
  marker.bindPopup(popupContent);
});

// Function to navigate to a destination
function navigateTo(destLatitude, destLongitude) {
  // Check if geolocation is available
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        var currentLatitude = position.coords.latitude;
        var currentLongitude = position.coords.longitude;

        // Generate the navigation URL
        var url = generateNavigationURL(currentLatitude, currentLongitude, destLatitude, destLongitude);

        // Open the navigation app
        window.location.href = url;
      },
      function (error) {
        alert('Unable to retrieve your current location.');
      }
    );
  } else {
    alert('Geolocation is not supported by your browser.');
  }
}

function generateNavigationURL(destLatitude, destLongitude) {
  var url = `intent://maps.google.com/maps?daddr=${destLatitude},${destLongitude}#Intent;scheme=https;package=com.google.android.apps.maps;end`;
  return url;
}

// // Function to generate the navigation URL
// function generateNavigationURL(currentLatitude, currentLongitude, destLatitude, destLongitude) {
  
//   var ua = navigator.userAgent.toLowerCase();
//   var url = '';

//   if (/iphone|ipad|ipod/.test(ua)) {
//     // Apple Maps URL
//     url = `http://maps.apple.com/?saddr=${currentLatitude},${currentLongitude}&daddr=${destLatitude},${destLongitude}&dirflg=d`;
//   } else if (/android/.test(ua)) {
//     // Google Maps URL
//     url = `https://maps.google.com/maps?daddr=${destLatitude},${destLongitude}&saddr=${currentLatitude},${currentLongitude}&directionsmode=driving`;
//   } else {
//     // Default to Google Maps in browser
//     url = `https://www.google.com/maps/dir/?api=1&origin=${currentLatitude},${currentLongitude}&destination=${destLatitude},${destLongitude}&travelmode=driving`;
//   }

//   return url;
// }