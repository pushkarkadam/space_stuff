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
                    var label = position["tle"]["name"];
                    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`)

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
                        var label = position["tle"]["name"];
                        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`)

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
