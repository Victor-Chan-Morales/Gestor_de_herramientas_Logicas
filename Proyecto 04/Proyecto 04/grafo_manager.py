
import osmnx as ox
import heapq
from config import DEFAULT_SPEED


class GrafoManager:
    
    def __init__(self, place_name):
        self.place_name = place_name
        self.G = None
        self.load_graph()
    
    def load_graph(self):
        print(f"Cargando grafo de {self.place_name}...")
        self.G = ox.graph_from_place(self.place_name, network_type="drive")
        
        # Preprocesar velocidades y pesos de las aristas
        for edge in self.G.edges:
            maxspeed = DEFAULT_SPEED
            if "maxspeed" in self.G.edges[edge]:
                maxspeed = self.G.edges[edge]["maxspeed"]
                if type(maxspeed) == list:
                    speeds = [int(speed) for speed in maxspeed]
                    maxspeed = min(speeds)
                elif type(maxspeed) == str:
                    maxspeed = int(maxspeed)
            
            self.G.edges[edge]["maxspeed"] = maxspeed
            self.G.edges[edge]["weight"] = self.G.edges[edge]["length"] / maxspeed
        
        print(f"Grafo cargado: {len(self.G.nodes)} nodos, {len(self.G.edges)} aristas")
    
    def get_bounds(self):
        nodes = self.G.nodes
        xs = [nodes[n]["x"] for n in nodes]
        ys = [nodes[n]["y"] for n in nodes]
        return min(xs), max(xs), min(ys), max(ys)
    
    def dijkstra(self, orig, dest):

        nodes = self.G.nodes
        edges = self.G.edges
        
        # Inicializar todos los nodos
        for node in nodes:
            nodes[node].update({
                "visited": False,
                "distance": float("inf"),
                "previous": None
            })
        
        # Configurar nodo origen
        nodes[orig]["distance"] = 0
        pq = [(0, orig)]
        iterations = 0
        
        while pq:
            _, node = heapq.heappop(pq)
            
            if node == dest:
                return iterations
            
            if nodes[node]["visited"]:
                continue
            
            nodes[node]["visited"] = True
            node_dist = nodes[node]["distance"]
            
            # Explorar vecinos
            for u, neighbor in self.G.out_edges(node):
                weight = edges[(u, neighbor, 0)]["weight"]
                new_dist = node_dist + weight
                
                if nodes[neighbor]["distance"] > new_dist:
                    nodes[neighbor]["distance"] = new_dist
                    nodes[neighbor]["previous"] = node
                    heapq.heappush(pq, (new_dist, neighbor))
            
            iterations += 1
        
        return iterations
    
    def reconstruct_path(self, orig, dest):

        nodes = self.G.nodes
        edges = self.G.edges
        
        # Verificar que existe camino
        if nodes[dest]["previous"] is None:
            return None, 0, 0, 0
        
        # Reconstruir camino desde destino a origen
        path, dist, speeds = [], 0, []
        curr = dest
        
        while curr != orig:
            path.append(curr)
            prev = nodes[curr]["previous"]
            edge_data = edges[(prev, curr, 0)]
            dist += edge_data["length"]
            speeds.append(edge_data["maxspeed"])
            curr = prev
        
        path.append(orig)
        path.reverse()
        
        # Calcular estadísticas
        dist_km = dist / 1000
        avg_speed = sum(speeds) / len(speeds) if speeds else DEFAULT_SPEED
        time_min = (dist_km / avg_speed) * 60
        
        return path, dist_km, avg_speed, time_min

