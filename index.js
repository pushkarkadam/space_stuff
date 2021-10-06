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

    // var spaceObject = L.icon({
    //     iconUrl: 'images/hexagon-fill-red.svg',
    //     iconSize: [14, 14]
    // });

    // Submitting the form to get all the space objects on the map
    document.querySelector('form').onsubmit = function() {
        const name = document.querySelector('#satellite').value;
        console.log(name);

        // Get all the satellites with matching name from the form.
        fetchSatellite(name)
        .then(satellites => {
            // Marks the initial position of the objects on the map
            for (var i = 0; i < satellites["member"].length; i++) {
                fetchPosition(satellites["member"][i]["satelliteId"])
                .then(position => {
                    var latitude = position["geodetic"]["latitude"];
                    var longitude = position["geodetic"]["longitude"];
                    var altitude = position["geodetic"]["altitude"].toFixed(2);
                    var velocity = position["vector"]["velocity"]["r"].toFixed(2);
                    var label = "<strong>ID</strong>: " + String(position["parameters"]["satelliteId"]) + "<br>"
                                + "<strong>Name</strong>:" + String(position["tle"]["name"]) + "<br>"
                                + "<strong>Altitude</strong>:" + String(altitude) + " km" + "<br>"
                                + "<strong>Velocity</strong>:" + String(velocity) + " km/s";

                    console.log(`Latitude: ${latitude}, Longitude: ${longitude}, Altitude: ${altitude}, Velocity: ${velocity}`);

                    var spaceObject = getIconColor(altitude);

                    // Adding marker
                    L.marker([latitude, longitude], {icon: spaceObject}).bindPopup(label).addTo(map);
                })
                .catch(err => {
                    console.log(err.message);
                })
            }
            // Runs the following program for 30 seconds
            setInterval(function() {
                // Again iterate over all the objects to tract its current position
                for (var i = 0; i < satellites["member"].length; i++) {
                    fetchPosition(satellites["member"][i]["satelliteId"])
                    .then(position => {
                        var latitude = position["geodetic"]["latitude"];
                        var longitude = position["geodetic"]["longitude"];
                        var altitude = position["geodetic"]["altitude"].toFixed(2);
                        var velocity = position["vector"]["velocity"]["r"].toFixed(2);
                        var label = "<strong>ID</strong>: " + String(position["parameters"]["satelliteId"]) + "<br>"
                                    + "<strong>Name</strong>:" + String(position["tle"]["name"]) + "<br>"
                                    + "<strong>Altitude</strong>:" + String(altitude) + " km" + "<br>"
                                    + "<strong>Velocity</strong>:" + String(velocity) + " km/s";

                        console.log(`Latitude: ${latitude}, Longitude: ${longitude}, Altitude: ${altitude}, Velocity: ${velocity}`);

                        var spaceObject = getIconColor(altitude);

                        // Adding marker
                        L.marker([latitude, longitude], {icon: spaceObject}).bindPopup(label).addTo(map);
                    })
                    .catch(err => {
                        console.log(err.message);
                    })
                }
            }, 30000)

        })
        .catch(err => {
            console.log(err.message);
        })

        // Prevent default submission
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

function getIconColor(altitude) {
    // Low earth orbit
    if (altitude < 2000) {
        icon = 'images/hexagon-fill-red.svg';
    } else if (altitude < 35786) {
        icon = 'images/hexagon-fill-blue.svg';
    } else {
        icon = 'images/hexagon-fill-black.svg'
    }

    var spaceObject = L.icon({
        iconUrl: icon,
        iconSize: [14, 14]
    });

    return spaceObject;
}
