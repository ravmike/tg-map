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