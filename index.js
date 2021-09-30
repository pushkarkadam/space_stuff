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

    // var satelliteIds = [];

    document.querySelector('form').onsubmit = function() {
        const name = document.querySelector('#satellite').value;
        console.log(name);
        fetchSatellite(name)
        .then(satellites => {
            for (var i = 0; i < satellites["member"].length; i++) {
                fetchPosition(satellites["member"][i]["satelliteId"])
                .then(position => {
                    latitude = position["geodetic"]["latitude"];
                    longitude = position["geodetic"]["longitude"];
                    label = position["tle"]["name"];
                    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`)

                    // Adding marker
                    L.marker([latitude, longitude], {icon: spaceObject}).bindPopup(label).addTo(map);
                })
                .catch(err => {
                    console.log(err.message);
                })
            }
        })
        .catch(err => {
            console.log(err.message);
        })
        return false;
    };
})

async function fetchPosition(satelliteId) {
    // Send a GET request to the URL
    const response = await fetch(`https://tle.ivanstanojevic.me/api/tle/${satelliteId}/propagate`);
    const position = await response.json();
    return position;
}

async function fetchSatellite(name) {
    const response = await fetch(`https://tle.ivanstanojevic.me/api/tle/?search=${name}`);
    const satellites = await response.json();
    return satellites;
}
