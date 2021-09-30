document.addEventListener('DOMContentLoaded', function() {
    // Creating a map variable
    var map = L.map('map',{
        center: [9.0820, 8.6753],
        zoom:2
    });

    // Adding open street map layer
    var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var spaceObject = L.icon({
        iconUrl: 'images/hexagon-fill.svg'
    });

    // Send a GET request to get all TLE objects. API has maz page-size=100, therefore hard-coding the value
    fetch('https://tle.ivanstanojevic.me/api/tle/?page-size=100').
    then(response => response.json())
    .then(data => {
        // Array of all the satelliteId from the API call.
        var satelliteIds = [];


        for (var i = 0; i < data["member"].length; i++) {
            satelliteIds.push(data["member"][i]["satelliteId"]);
        }

        console.log(satelliteIds);

        // Send a GET request to the URL
        fetch('https://tle.ivanstanojevic.me/api/tle/25544/propagate')
        .then(response => response.json())
        .then(data => {
            console.log(data["geodetic"]);
            console.log(data["tle"]["name"])
            latitude = data["geodetic"]["latitude"]
            longitude = data["geodetic"]["longitude"]
            label = data["tle"]["name"]

            // Adding marker
            L.marker([latitude, longitude], {icon: spaceObject}).bindPopup(label).addTo(map)
        })
    })


})
