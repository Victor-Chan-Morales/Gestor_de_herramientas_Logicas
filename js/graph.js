class Graph {
    constructor() {
        this.nodes = new Map();
        this.edges = new Map();
    }

    addNode(id, lat, lon) {
        this.nodes.set(id, { id, lat, lon });
    }

    addEdge(fromId, toId, weight) {
        const edgeId = `${fromId}-${toId}`;
        this.edges.set(edgeId, { from: fromId, to: toId, weight });
    }

    getNeighbors(nodeId) {
        const neighbors = [];
        this.edges.forEach((edge, edgeId) => {
            if (edge.from === nodeId) {
                neighbors.push({
                    node: this.nodes.get(edge.to),
                    weight: edge.weight
                });
            }
        });
        return neighbors;
    }

    dijkstra(startId, endId) {
        const distances = new Map();
        const previous = new Map();
        const unvisited = new Set();

        // Inicializar distancias
        this.nodes.forEach((node, id) => {
            distances.set(id, Infinity);
            unvisited.add(id);
        });
        distances.set(startId, 0);

        while (unvisited.size > 0) {
            // Encontrar el nodo no visitado con la menor distancia
            let current = null;
            let minDistance = Infinity;
            unvisited.forEach(id => {
                const distance = distances.get(id);
                if (distance < minDistance) {
                    minDistance = distance;
                    current = id;
                }
            });

            if (current === null || current === endId) break;

            unvisited.delete(current);

            // Actualizar distancias a los vecinos
            this.getNeighbors(current).forEach(({ node, weight }) => {
                if (!unvisited.has(node.id)) return;
                
                const newDistance = distances.get(current) + weight;
                if (newDistance < distances.get(node.id)) {
                    distances.set(node.id, newDistance);
                    previous.set(node.id, current);
                }
            });
        }

        // Reconstruir el camino
        const path = [];
        let current = endId;
        while (current !== undefined) {
            path.unshift(this.nodes.get(current));
            current = previous.get(current);
        }

        return {
            path,
            distance: distances.get(endId)
        };
    }
}