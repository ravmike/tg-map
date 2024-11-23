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

// Variable to store the compass marker
var compassMarker;

// Function to handle device orientation and update compass
function handleOrientation(event) {
  var alpha = event.alpha; // Rotation around z-axis (0 to 360 degrees)
  var rotation = alpha ? alpha : 0; // Use alpha directly for rotation

  // Update the compass marker's rotation angle
  if (compassMarker) {
    compassMarker.setRotationAngle(rotation);
  }
}

// Function to request device orientation
function requestDeviceOrientation() {
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    // iOS 13+ devices
    DeviceOrientationEvent.requestPermission()
      .then((permissionState) => {
        if (permissionState === 'granted') {
          document.getElementById('enable-button').style.display = 'none';
          window.addEventListener('deviceorientation', handleOrientation, true);
        } else {
          alert('Permission to access device orientation was denied.');
        }
      })
      .catch(console.error);
  } else {
    // Non iOS 13+ devices
    document.getElementById('enable-button').style.display = 'none';
    window.addEventListener('deviceorientation', handleOrientation, true);
  }
}

// Function to add user's location and compass
function addUserLocation() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        // Custom icon for the compass marker
        var compassIcon = L.icon({
          iconUrl: 'assets/compass.png',
          iconSize: [20, 20],
          iconAnchor: [25, 25],
        });

        // Add the compass marker at the user's location with initial rotation
        compassMarker = L.marker([latitude, longitude], {
          icon: compassIcon,
          rotationAngle: 0, // Initial rotation
          rotationOrigin: 'center',
        }).addTo(map);

        // Center the map on the user's location
        map.setView([latitude, longitude], 16);

        // Request device orientation permission if necessary
        requestDeviceOrientation();
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

function generateNavigationURL(currentLatitude, currentLongitude, destLatitude, destLongitude) {
  var ua = navigator.userAgent.toLowerCase();
  var url = '';

  if (/iphone|ipad|ipod/.test(ua)) {
    // Apple Maps URL
    url = `http://maps.apple.com/?saddr=${currentLatitude},${currentLongitude}&daddr=${destLatitude},${destLongitude}&dirflg=d`;
  } else if (/android/.test(ua)) {
    // Google Maps URL
    url = `https://maps.google.com/maps?daddr=${destLatitude},${destLongitude}&saddr=${currentLatitude},${currentLongitude}&directionsmode=driving`;
  } else {
    // Default to Google Maps in browser
    url = `https://www.google.com/maps/dir/?api=1&origin=${currentLatitude},${currentLongitude}&destination=${destLatitude},${destLongitude}&travelmode=driving`;
  }

  return url;
}

function navigateTo(destLatitude, destLongitude) {
  // Generate the navigation URL
  var url = generateNavigationURL(destLatitude, destLongitude);

  // Open the link using Telegram's openLink method
  if (window.Telegram && Telegram.WebApp && Telegram.WebApp.openLink) {
    Telegram.WebApp.openLink(url);
  } else {
    // Fallback for when not in Telegram
    window.open(url, '_blank');
  }
}

function navigateTo(destLatitude, destLongitude) {
  // Check if geolocation is available
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        var currentLatitude = position.coords.latitude;
        var currentLongitude = position.coords.longitude;

        // Generate the navigation URL
        var url = generateNavigationURL(currentLatitude, currentLongitude, destLatitude, destLongitude);

        // Open the link using Telegram's openLink method
        if (window.Telegram && Telegram.WebApp && Telegram.WebApp.openLink) {
          Telegram.WebApp.openLink(url);
        } else {
          // Fallback for when not in Telegram
          window.open(url, '_blank');
        }
      },
      function (error) {
        alert('Unable to retrieve your current location.');
      }
    );
  } else {
    alert('Geolocation is not supported by your browser.');
  }
}


// Call the function to add user's location and compass
addUserLocation();

// Fit the map view to show all markers (optional)
var allMarkers = locations.map(function (location) {
  return L.marker(location.coords);
});

// Include the compass marker if it exists
if (compassMarker) {
  allMarkers.push(compassMarker);
}

var group = L.featureGroup(allMarkers);
map.fitBounds(group.getBounds().pad(0.5));