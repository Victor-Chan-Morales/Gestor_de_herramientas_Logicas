import customtkinter as ctk
from config import (
    CANVAS_BG, CANVAS_PADDING, NODE_RADIUS, SELECTED_NODE_RADIUS,
    ZOOM_MIN, ZOOM_MAX, ZOOM_STEP, ZOOM_THRESHOLD_SHOW_NODES,
    EDGE_COLOR, NODE_COLOR, PATH_COLOR, ORIGIN_COLOR, DESTINATION_COLOR
)


class MapCanvas(ctk.CTkCanvas):
    
    def __init__(self, parent, grafo_manager):
        super().__init__(parent, bg=CANVAS_BG, highlightthickness=0)
        self.grafo_manager = grafo_manager
        self.padding = CANVAS_PADDING
        self.node_radius = NODE_RADIUS
        self.selected_node_radius = SELECTED_NODE_RADIUS
        
        # Dimensiones y transformación
        self.canvas_width = 800
        self.canvas_height = 600
        self._canvas_initialized = False
        self.scale = 1.0
        self.min_x = self.min_y = self.offset_x = self.offset_y = 0
        
        # Configuración de zoom
        self.zoom_level = 1.0
        self.min_zoom = ZOOM_MIN
        self.max_zoom = ZOOM_MAX
        self.zoom_step = ZOOM_STEP
        
        # Estado de visualización
        self.current_path = None
        self.graph_drawn = False
        self._origin_node = None
        self._destination_node = None
        
        # Control de zoom con debouncing
        self._zoom_timer = None
        
        # Variables para panning (arrastrar canvas)
        self.pan_start_x = 0
        self.pan_start_y = 0
        self.pan_offset_x = 0
        self.pan_offset_y = 0
        self.is_panning = False
        
        # Configurar eventos de zoom
        self.bind("<MouseWheel>", self._on_mousewheel)
        self.bind("<Button-4>", lambda e: self._on_mousewheel(e, delta=1))   # Linux scroll up
        self.bind("<Button-5>", lambda e: self._on_mousewheel(e, delta=-1))  # Linux scroll down
        
        # Configurar eventos de panning (arrastrar con botón derecho o rueda del mouse)
        self.bind("<ButtonPress-2>", self._start_pan)     # Botón medio (rueda)
        self.bind("<B2-Motion>", self._do_pan)
        self.bind("<ButtonRelease-2>", self._end_pan)
        
        self.bind("<ButtonPress-3>", self._start_pan)     # Botón derecho
        self.bind("<B3-Motion>", self._do_pan)
        self.bind("<ButtonRelease-3>", self._end_pan)
    
    def initialize_canvas_size(self):
        if not self._canvas_initialized:
            width = self.winfo_width()
            height = self.winfo_height()
            if width > 1 and height > 1:
                self.canvas_width = width
                self.canvas_height = height
                self._canvas_initialized = True
                self.update_bounds()
            else:
                self.update_bounds()
    
    def _on_mousewheel(self, event, delta=None):
        if delta is None:
            delta = event.delta
        
        new_zoom = self.zoom_level + (self.zoom_step if delta > 0 else -self.zoom_step)
        new_zoom = max(self.min_zoom, min(new_zoom, self.max_zoom))
        
        if new_zoom != self.zoom_level:
            self.zoom_level = new_zoom
            self.update_bounds()
            
            # Cancelar redibujado anterior si existe
            if self._zoom_timer:
                self.after_cancel(self._zoom_timer)
            
            # Programar redibujado con delay de 100ms (solo redibuja cuando dejas de hacer zoom)
            self._zoom_timer = self.after(100, self.redraw_current_state)
    
    def _start_pan(self, event):
        self.pan_start_x = event.x
        self.pan_start_y = event.y
        self.is_panning = True
        self.config(cursor="fleur")  # Cursor de mover
    
    def _do_pan(self, event):
        """Realiza el panning del canvas de forma fluida"""
        if not self.is_panning:
            return
        
        # Calcular desplazamiento
        dx = event.x - self.pan_start_x
        dy = event.y - self.pan_start_y
        
        # Mover todos los elementos del canvas (mucho más rápido que redibujar)
        self.move("all", dx, dy)
        
        # Actualizar offset de panning para futuras operaciones
        self.pan_offset_x += dx
        self.pan_offset_y += dy
        
        # Actualizar posición inicial para el siguiente movimiento
        self.pan_start_x = event.x
        self.pan_start_y = event.y
    
    def _end_pan(self, event):
        self.is_panning = False
        self.config(cursor="")
    
    def reset_pan(self):
        self.pan_offset_x = 0
        self.pan_offset_y = 0
        self.update_bounds()
        self.redraw_current_state()
    
    def update_bounds(self):
        if not self.grafo_manager.G:
            return
        
        min_x, max_x, min_y, max_y = self.grafo_manager.get_bounds()
        
        # Calcular escala manteniendo aspect ratio
        data_width = max_x - min_x
        data_height = max_y - min_y
        canvas_width = self.canvas_width - 2 * self.padding
        canvas_height = self.canvas_height - 2 * self.padding
        
        scale_x = canvas_width / data_width if data_width > 0 else 1
        scale_y = canvas_height / data_height if data_height > 0 else 1
        self.scale = min(scale_x, scale_y) * self.zoom_level
        
        # Guardar transformación
        self.min_x = min_x
        self.min_y = min_y
        self.offset_x = self.padding + (canvas_width - data_width * self.scale) / 2 + self.pan_offset_x
        self.offset_y = self.padding + (canvas_height - data_height * self.scale) / 2 + self.pan_offset_y
        
        self._update_scrollregion()
    
    def _update_scrollregion(self):
        if not self.grafo_manager.G:
            return
        
        min_x, max_x, min_y, max_y = self.grafo_manager.get_bounds()
        data_width = (max_x - min_x) * self.scale
        data_height = (max_y - min_y) * self.scale
        
        # Agregar padding y margen extra para permitir desplazamiento
        margin = 200
        scroll_width = data_width + 2 * self.padding + margin
        scroll_height = data_height + 2 * self.padding + margin
        
        # Configurar la región de scroll
        self.configure(scrollregion=(-margin/2, -margin/2, scroll_width, scroll_height))
    
    def geo_to_canvas(self, x, y):
        cx = self.offset_x + (x - self.min_x) * self.scale
        cy = self.canvas_height - (self.offset_y + (y - self.min_y) * self.scale)
        return cx, cy
    
    def canvas_to_geo(self, cx, cy):
        x = self.min_x + (cx - self.offset_x) / self.scale
        y = self.min_y + (self.canvas_height - cy - self.offset_y) / self.scale
        return x, y
    
    def get_node_coords(self, node):
        G = self.grafo_manager.G
        return self.geo_to_canvas(G.nodes[node]["x"], G.nodes[node]["y"])
    
    def get_edge_coords(self, u, v):
        G = self.grafo_manager.G
        x1, y1 = G.nodes[u]["x"], G.nodes[u]["y"]
        x2, y2 = G.nodes[v]["x"], G.nodes[v]["y"]
        return self.geo_to_canvas(x1, y1) + self.geo_to_canvas(x2, y2)
    
    def draw_node_marker(self, node, color, tag):
        size = max(3, int(self.selected_node_radius * self.zoom_level))  # Reducido de max(5, ...) a max(3, ...)
        cx, cy = self.get_node_coords(node)
        self.create_oval(
            cx - size, cy - size, cx + size, cy + size,
            fill=color, outline="#ffffff", width=1, tags=tag  # Borde reducido de 2 a 1
        )
    
    def find_nearest_node(self, cx, cy, max_distance=30):
        min_dist = float('inf')
        nearest_node = None
        
        for node in self.grafo_manager.G.nodes:
            node_cx, node_cy = self.get_node_coords(node)
            dist = ((node_cx - cx)**2 + (node_cy - cy)**2)**0.5
            if dist < min_dist:
                min_dist = dist
                nearest_node = node
        
        return nearest_node if min_dist <= max_distance else None
    
    def redraw_current_state(self):
        if self.current_path:
            self.highlight_path(self.current_path, self._origin_node, self._destination_node)
        else:
            self.draw_graph()
            if self._origin_node:
                self.draw_node_marker(self._origin_node, ORIGIN_COLOR, "origin")
            if self._destination_node:
                self.draw_node_marker(self._destination_node, DESTINATION_COLOR, "destination")
    
    def draw_graph(self):
        self.delete("all")
        if not self.grafo_manager.G:
            return
        
        # Dibujar todas las aristas
        for u, v, _ in self.grafo_manager.G.edges:
            cx1, cy1, cx2, cy2 = self.get_edge_coords(u, v)
            self.create_line(cx1, cy1, cx2, cy2, fill=EDGE_COLOR, width=1, tags="edge")
        
        # Dibujar nodos solo con zoom alto (para mejor rendimiento)
        if self.zoom_level > ZOOM_THRESHOLD_SHOW_NODES:
            r = self.node_radius
            for node in self.grafo_manager.G.nodes:
                cx, cy = self.get_node_coords(node)
                self.create_oval(
                    cx - r, cy - r, cx + r, cy + r,
                    fill=NODE_COLOR, outline="", tags="node"
                )
        
        self.graph_drawn = True
    
    def highlight_path(self, path, origin=None, destination=None):
        self.current_path = path
        self._origin_node = origin
        self._destination_node = destination
        self.draw_graph()
        
        if not path or len(path) < 2:
            return
        
        # Dibujar aristas del camino
        line_width = max(1, int(2 * self.zoom_level))  # Reducido de max(2, 3*zoom) a max(1, 2*zoom)
        for i in range(len(path) - 1):
            cx1, cy1, cx2, cy2 = self.get_edge_coords(path[i], path[i + 1])
            self.create_line(cx1, cy1, cx2, cy2, fill=PATH_COLOR, width=line_width, tags="path")
        
        # Dibujar nodos del camino
        node_size = max(2, int(3 * self.zoom_level))  # Reducido de max(3, 5*zoom) a max(2, 3*zoom)
        for node in path:
            cx, cy = self.get_node_coords(node)
            self.create_oval(
                cx - node_size, cy - node_size, cx + node_size, cy + node_size,
                fill=PATH_COLOR, outline="#ffffff", width=1, tags="path_node"  # Borde reducido de 2 a 1
            )
        
        # Destacar origen y destino
        if origin:
            self.draw_node_marker(origin, ORIGIN_COLOR, "origin")
        if destination:
            self.draw_node_marker(destination, DESTINATION_COLOR, "destination")
    
    def highlight_selected_nodes(self, origin=None, destination=None):
        self._origin_node = origin
        self._destination_node = destination
        self.current_path = None
        
        # Eliminar marcadores anteriores
        self.delete("origin", "destination", "path", "path_node")
        
        # Dibujar grafo si es necesario
        if not self.graph_drawn:
            self.draw_graph()
        
        # Dibujar nodos seleccionados
        if origin:
            self.draw_node_marker(origin, ORIGIN_COLOR, "origin")
        if destination:
            self.draw_node_marker(destination, DESTINATION_COLOR, "destination")

