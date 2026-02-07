  Smart Route Navigator: Real-World Multi-Stop Routing
This project is an advanced web-based navigation application that calculates the shortest path between multiple waypoints using Dijkstra's Algorithm logic and real-world road network data. Developed for the CENG 3511: Artificial Intelligence course, it goes beyond simple linear distances by following actual streets and pedestrian paths in the Muğla region.

  Advanced Features
Real-Road Navigation: Uses the OSRM (Open Source Routing Machine) API to ensure the path follows actual roads, alleys, and highways.

Multi-Stop Support: Allows users to add a source, multiple intermediate waypoints, and a final destination in sequence.

Intelligent Routing Steps: Provides detailed, turn-by-turn navigation instructions (e.g., "Turn left onto Zübeyde Hanım Avenue").

Dynamic Distance & Time: Calculates cumulative distance and estimated travel time based on real-world traffic geometry.

Professional Visualization: Renders the computed path with a high-fidelity polyline that snaps perfectly to the map's road network.

  Technology Stack
Frontend: HTML5, CSS3, JavaScript.

Map Library: Leaflet.js for interactive map rendering.

Data Source: OpenStreetMap contributors.

Routing Engine: OSRM API (Open Source Routing Machine) for processing road networks.

  Project Structure
As per the project guidelines:

index.html: Main UI structure and information panel.

style.css: Responsive design and aesthetic control.

script.js: Handles API calls, map interactions, and dynamic path visualization.

dijkstra.js: The algorithmic core for shortest path logic.

README.md: Project documentation and installation guide.

  How to Use
Ensure all project files are in the same folder.

Open index.html in a modern web browser (Internet connection is required for map tiles and routing API).

Click once to set the Source.

Click again to add Waypoints or the Destination.

Observe the blue polyline following the actual roads on the map.

Check the side panel for total distance, time, and step-by-step instructions.

  Methodology
The application transforms user-selected coordinates into a graph-based problem. While Dijkstra's algorithm provides the logic for finding the shortest path, the OSRM API provides the real-world "edges" (streets) and "weights" (actual driving distances). This ensures that the calculated path is not just mathematically correct, but practically usable.