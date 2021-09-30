document.addEventListener('DOMContentLoaded', function() {
    // Creating a map variable
    var map_init = L.map('map',{
        center: [9.0820, 8.6753],
        zoom:2
    });

    // Adding open street map layer
    var osm = L.tileLayer ('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo (map_init);

    // Adding markers
    // var marker = L.marker([9.0820, 8.6753]).addTo(map_init);

    var spaceObject = L.icon({
        iconUrl: 'images/hexagon-fill.svg'
    });

    // Send a GET request to the URL
    fetch('https://tle.ivanstanojevic.me/api/tle/25544/propagate')
    .then(response => response.json())
    .then(data => {
        console.log(data["geodetic"]);
        latitude = data["geodetic"]["latitude"]
        longitude = data["geodetic"]["longitude"]
        L.marker([latitude, longitude], {icon: spaceObject}).addTo(map_init)
    })
})
