function runDijkstra(graph, startNode, endNode) {
    let distances = {};
    let previous = {};
    let nodes = new Set(graph.nodes);

    graph.nodes.forEach(node => {
        distances[node] = Infinity;
        previous[node] = null;
    });
    distances[startNode] = 0;

    while (nodes.size > 0) {
        let closestNode = Array.from(nodes).reduce((min, node) => 
            distances[node] < distances[min] ? node : min, Array.from(nodes)[0]);

        if (closestNode === endNode || distances[closestNode] === Infinity) break;
        nodes.delete(closestNode);

        if (graph.edges[closestNode]) {
            graph.edges[closestNode].forEach(neighbor => {
                let alt = distances[closestNode] + neighbor.weight;
                if (alt < distances[neighbor.node]) {
                    distances[neighbor.node] = alt;
                    previous[neighbor.node] = closestNode;
                }
            });
        }
    }

    let path = [];
    let current = endNode;
    while (current) {
        path.unshift(current);
        current = previous[current];
    }

    return { path, distance: distances[endNode] };
}