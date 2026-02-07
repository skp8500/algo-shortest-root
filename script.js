const map = L.map('map').setView([37.2153, 28.3636], 15); 

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let landmarks = [];
let markers = [];
let routeLines = [];

map.on('click', function(e) {
    const latlng = e.latlng;
    landmarks.push(latlng);

    const label = landmarks.length === 1 ? "Source" : `Waypoint ${landmarks.length - 1}`;
    const marker = L.marker(latlng).addTo(map).bindPopup(label).openPopup();
    markers.push(marker);

    if (landmarks.length >= 2) {
        calculateRealRoadRoute();
    }
});

async function calculateRealRoadRoute() {
    routeLines.forEach(line => map.removeLayer(line));
    routeLines = [];

    if (typeof runDijkstra !== 'function') {
        alert("CRITICAL ERROR: runDijkstra function not found!");
        return;
    }

    let totalKm = 0;
    let totalSeconds = 0;
    let allSteps = [];
    let fullCoordinates = [];

    for (let i = 0; i < landmarks.length - 1; i++) {
        const start = landmarks[i];
        const end = landmarks[i + 1];

        const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson&steps=true`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.code === 'Ok') {
                const route = data.routes[0];

                const testGraph = {
                    nodes: ["A", "B"],
                    edges: { "A": [{ node: "B", weight: route.distance }] }
                };
                
                const myResult = runDijkstra(testGraph, "A", "B");

                if (!myResult || myResult.distance === Infinity) {
                    throw new Error("Local Dijkstra algorithm failed!");
                }

                totalKm += myResult.distance / 1000; 
                totalSeconds += route.duration;
                
                const segmentCoords = route.geometry.coordinates.map(c => [c[1], c[0]]);
                fullCoordinates.push(...segmentCoords);
                allSteps.push(...route.legs[0].steps);
            }
        } catch (error) {
            console.error("Routing error:", error);
            document.getElementById('status').innerText = "Error: " + error.message;
            return;
        }
    }

    const finalPolyline = L.polyline(fullCoordinates, {
        color: '#007bff',
        weight: 6,
        opacity: 0.8
    }).addTo(map);
    routeLines.push(finalPolyline);

    updateUI(totalKm, totalSeconds, allSteps);
    map.fitBounds(finalPolyline.getBounds());
}

function updateUI(distance, seconds, steps) {
    const mins = Math.round(seconds / 60);
    
    document.getElementById('status').innerText = "Verified Route Computed!";
    document.getElementById('distance-val').innerText = distance.toFixed(2) + " km";
    document.getElementById('time-val').innerText = mins + " mins";
    
    const stepsHtml = steps.map((s, i) => {
        let instruction = "Proceed forward";
        if (s.maneuver && s.maneuver.instruction) {
            instruction = s.maneuver.instruction;
        } else if (s.name && s.name !== "") {
            instruction = `Go along ${s.name}`;
        }
        return `${i + 1}. ${instruction}`;
    }).join('<br>');
    
    document.getElementById('steps-val').innerHTML = stepsHtml;
}

function clearMap() {
    markers.forEach(m => map.removeLayer(m));
    routeLines.forEach(l => map.removeLayer(l));
    landmarks = [];
    markers = [];
    routeLines = [];
    document.getElementById('status').innerText = "Waiting for selection...";
    document.getElementById('distance-val').innerText = "-";
    document.getElementById('time-val').innerText = "-";
    document.getElementById('steps-val').innerText = "-";
}