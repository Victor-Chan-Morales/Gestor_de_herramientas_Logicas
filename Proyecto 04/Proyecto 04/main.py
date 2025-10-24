
import customtkinter as ctk
from grafo_manager import GrafoManager
from canvas_mapa import MapCanvas
from config import (
    APP_TITLE, APP_GEOMETRY, APP_MIN_SIZE, PLACE_NAME,
    APPEARANCE_MODE, COLOR_THEME, SIDEBAR_WIDTH,
    INFO_FRAME_HEIGHT, RESULTS_FRAME_HEIGHT
)


class RutaMasCortaApp(ctk.CTk):
    
    def __init__(self):
        super().__init__()
        
        # Configurar ventana
        self.title(APP_TITLE)
        self.geometry(APP_GEOMETRY)
        self.minsize(*APP_MIN_SIZE)
        
        self.origin_node = None
        self.destination_node = None
        self.current_path = None
        
        self._configurar_layout()
        
        # Crear interfaz
        self._crear_sidebar()
        self._crear_area_principal()
        self.after(100, self._init_grafo)
    
    def _configurar_layout(self):
        self.grid_rowconfigure(0, weight=1, minsize=600)
        self.grid_columnconfigure(0, weight=0, minsize=SIDEBAR_WIDTH)  
        self.grid_columnconfigure(1, weight=1, minsize=600) 
        
        # Sidebar con ancho fijo
        self.sidebar = ctk.CTkFrame(self, width=SIDEBAR_WIDTH, corner_radius=8)
        self.sidebar.grid(row=0, column=0, sticky="ns", padx=(18, 10), pady=18)
        self.sidebar.pack_propagate(False)
        self.sidebar.grid_propagate(False)
        
        # Área principal
        self.main_area = ctk.CTkFrame(self, corner_radius=8)
        self.main_area.grid(row=0, column=1, sticky="nsew", padx=(0, 18), pady=18)
        self.main_area.grid_propagate(False)
    
    def _init_grafo(self):
        self.grafo_manager = GrafoManager(PLACE_NAME)
        self.map_canvas.grafo_manager = self.grafo_manager
        
        # Esperar a que el canvas tenga dimensiones válidas
        def try_initialize():
            width = self.map_canvas.winfo_width()
            height = self.map_canvas.winfo_height()
            if width > 1 and height > 1:
                self.map_canvas.initialize_canvas_size()
                self.map_canvas.draw_graph()
                self._set_estado("Grafo cargado")
            else:
                self.after(50, try_initialize)
        
        try_initialize()
        
        # Actualizar texto inicial
        self._actualizar_resultados("Selecciona origen y destino")
    
    def _crear_sidebar(self):
        # Título
        title = ctk.CTkLabel(
            self.sidebar,
            text="Explorador de rutas",
            font=ctk.CTkFont(size=20, weight="bold")
        )
        title.pack(anchor="n", pady=(12, 6))
        
        subtitle = ctk.CTkLabel(
            self.sidebar,
            text="Click izq: seleccionar | Click der/medio: mover",
            font=ctk.CTkFont(size=11),
            text_color="#bfc7d6"
        )
        subtitle.pack(anchor="n", pady=(0, 12))
        
        # Frame de información de selección
        info_frame = ctk.CTkFrame(self.sidebar, corner_radius=6, height=INFO_FRAME_HEIGHT)
        info_frame.pack(fill="x", padx=16, pady=(12, 16))
        info_frame.pack_propagate(False)
        
        # Origen
        ctk.CTkLabel(
            info_frame,
            text="Origen (verde):",
            anchor="w",
            font=ctk.CTkFont(size=12, weight="bold")
        ).pack(fill="x", padx=12, pady=(8, 2))
        
        self.origen_label = ctk.CTkLabel(
            info_frame,
            text="No seleccionado",
            anchor="w",
            text_color="#bfc7d6"
        )
        self.origen_label.pack(fill="x", padx=12, pady=(0, 8))
        
        # Destino
        ctk.CTkLabel(
            info_frame,
            text="Destino (rojo):",
            anchor="w",
            font=ctk.CTkFont(size=12, weight="bold")
        ).pack(fill="x", padx=12, pady=(4, 2))
        
        self.destino_label = ctk.CTkLabel(
            info_frame,
            text="No seleccionado",
            anchor="w",
            text_color="#bfc7d6"
        )
        self.destino_label.pack(fill="x", padx=12, pady=(0, 8))
        
        # Botones
        btn_frame = ctk.CTkFrame(self.sidebar, fg_color="transparent")
        btn_frame.pack(fill="x", padx=16, pady=(10, 6))
        
        self.btn_calcular = ctk.CTkButton(
            btn_frame,
            text="Calcular ruta",
            corner_radius=8,
            command=self._calcular_ruta
        )
        self.btn_calcular.pack(fill="x")
        
        self.btn_limpiar = ctk.CTkButton(
            self.sidebar,
            text="Limpiar selección",
            fg_color="#2b2f3a",
            hover_color="#323645",
            corner_radius=8,
            command=self._limpiar
        )
        self.btn_limpiar.pack(fill="x", padx=16, pady=(8, 4))
        
        self.btn_reset_vista = ctk.CTkButton(
            self.sidebar,
            text="Resetear vista",
            fg_color="#2b2f3a",
            hover_color="#323645",
            corner_radius=8,
            command=self._resetear_vista
        )
        self.btn_reset_vista.pack(fill="x", padx=16, pady=(4, 4))
        
        # Estado
        self.estado_label = ctk.CTkLabel(
            self.sidebar,
            text="Estado: Cargando...",
            anchor="w",
            text_color="#9fb0d6"
        )
        self.estado_label.pack(fill="x", padx=16, pady=(12, 4))
        
        # Resultados
        ctk.CTkLabel(
            self.sidebar,
            text="Resultados",
            anchor="w"
        ).pack(fill="x", padx=16, pady=(8, 4))
        
        resultados_container = ctk.CTkFrame(
            self.sidebar,
            fg_color="transparent",
            height=RESULTS_FRAME_HEIGHT
        )
        resultados_container.pack(fill="x", padx=16, pady=(4, 12))
        resultados_container.pack_propagate(False)
        
        self.resultados = ctk.CTkTextbox(resultados_container, corner_radius=6)
        self.resultados.pack(fill="both", expand=True)
        self.resultados.insert("0.0", "Esperando carga del grafo...\n")
        self.resultados.configure(state="disabled")
    
    def _crear_area_principal(self):
        # Header
        header = ctk.CTkFrame(self.main_area, height=70, corner_radius=6)
        header.pack(fill="x", padx=12, pady=(12, 8))
        header.pack_propagate(False)
        header.grid_columnconfigure(0, weight=1)
        
        ctk.CTkLabel(
            header,
            text=f"Grafo — {PLACE_NAME}",
            font=ctk.CTkFont(size=16, weight="bold")
        ).grid(row=0, column=0, sticky="w", padx=12)
        
        ctk.CTkLabel(
            header,
            text="Mapa de la ciudad | Rueda del mouse: zoom | Arrastra con click derecho: mover",
            text_color="#cbd6e6"
        ).grid(row=1, column=0, sticky="w", padx=12)
        
        # Canvas del mapa con scrollbars
        canvas_frame = ctk.CTkFrame(self.main_area, corner_radius=6)
        canvas_frame.pack(fill="both", expand=True, padx=12, pady=6)
        canvas_frame.pack_propagate(False)
        
        # Configurar grid para el canvas y las scrollbars
        canvas_frame.grid_rowconfigure(0, weight=1)
        canvas_frame.grid_columnconfigure(0, weight=1)
        
        # Crear scrollbars
        v_scrollbar = ctk.CTkScrollbar(canvas_frame, orientation="vertical")
        v_scrollbar.grid(row=0, column=1, sticky="ns", padx=(0, 6), pady=6)
        
        h_scrollbar = ctk.CTkScrollbar(canvas_frame, orientation="horizontal")
        h_scrollbar.grid(row=1, column=0, sticky="ew", padx=6, pady=(0, 6))
        
        # Crear canvas
        self.map_canvas = MapCanvas(canvas_frame, None)
        self.map_canvas.grid(row=0, column=0, sticky="nsew", padx=(6, 0), pady=(6, 0))
        
        # Conectar scrollbars con el canvas
        v_scrollbar.configure(command=self.map_canvas.yview)
        h_scrollbar.configure(command=self.map_canvas.xview)
        self.map_canvas.configure(yscrollcommand=v_scrollbar.set, xscrollcommand=h_scrollbar.set)
        
        # Bind de eventos
        self.map_canvas.bind("<Button-1>", self._on_canvas_click)
        
        # Panel de detalles
        details = ctk.CTkFrame(self.main_area, height=110, corner_radius=6)
        details.pack(fill="x", padx=12, pady=(8, 12))
        details.pack_propagate(False)
        details.grid_columnconfigure((0, 1, 2), weight=1)
        
        self.dist_label = ctk.CTkLabel(
            details,
            text="Distancia: -- km",
            font=ctk.CTkFont(size=13, weight="bold")
        )
        self.dist_label.grid(row=0, column=0, padx=12, pady=18, sticky="w")
        
        self.time_label = ctk.CTkLabel(
            details,
            text="Tiempo estimado: -- min",
            font=ctk.CTkFont(size=13, weight="bold")
        )
        self.time_label.grid(row=0, column=1, padx=12, pady=18)
        
        self.path_label = ctk.CTkLabel(
            details,
            text="Nodos en ruta: --",
            font=ctk.CTkFont(size=13)
        )
        self.path_label.grid(row=0, column=2, padx=12, pady=18, sticky="e")
    
    def _on_canvas_click(self, event):
        if not hasattr(self, 'grafo_manager') or not self.grafo_manager:
            return
        
        canvas_x = self.map_canvas.canvasx(event.x)
        canvas_y = self.map_canvas.canvasy(event.y)
        
        nearest = self.map_canvas.find_nearest_node(canvas_x, canvas_y)
        
        if nearest is None:
            self._set_estado("Click más cerca de un nodo.")
            return
        
        if self.origin_node is None:
            # Seleccionar origen
            self.origin_node = nearest
            self.origen_label.configure(text=f"Nodo {nearest}")
            self.map_canvas.highlight_selected_nodes(origin=self.origin_node)
            self._set_estado("Origen seleccionado. Selecciona destino.")
        
        elif self.destination_node is None:
            # Seleccionar destino
            if nearest == self.origin_node:
                self._set_estado("Selecciona un nodo diferente al origen.")
                return
            self.destination_node = nearest
            self.destino_label.configure(text=f"Nodo {nearest}")
            self.map_canvas.highlight_selected_nodes(
                origin=self.origin_node,
                destination=self.destination_node
            )
            self._set_estado("Origen y destino seleccionados. Haz click en 'Calcular ruta'.")
        
        else:
            # Reiniciar selección
            self.origin_node = nearest
            self.destination_node = None
            self.origen_label.configure(text=f"Nodo {nearest}")
            self.destino_label.configure(text="No seleccionado")
            self.map_canvas.highlight_selected_nodes(origin=self.origin_node)
            self._set_estado("Nuevo origen seleccionado. Selecciona destino.")
    
    def _calcular_ruta(self):
        if not hasattr(self, 'grafo_manager') or not self.grafo_manager:
            self._set_estado("Esperando a que se cargue el grafo.")
            return
        
        if self.origin_node is None or self.destination_node is None:
            self._set_estado("Selecciona origen y destino primero.")
            return
        
        self._set_estado("Calculando ruta...")
        
        iterations = self.grafo_manager.dijkstra(self.origin_node, self.destination_node)
        
        # Reconstruir camino
        path, dist_km, avg_speed, time_min = self.grafo_manager.reconstruct_path(
            self.origin_node,
            self.destination_node
        )
        
        if path is None:
            self._set_estado("No se encontró camino entre los nodos.")
            self._actualizar_resultados("No hay camino disponible entre los nodos seleccionados.\n")
            return
        
        # Visualizar camino
        self.map_canvas.highlight_path(
            path,
            origin=self.origin_node,
            destination=self.destination_node
        )
        
        # Actualizar información
        self._set_estado(f"Ruta calculada en {iterations} iteraciones.")
        self._mostrar_resultados(dist_km, avg_speed, time_min, len(path), iterations)
    
    def _mostrar_resultados(self, distancia, avg_speed, tiempo, num_nodos, iterations):
        self.dist_label.configure(text=f"Distancia: {distancia:.2f} km")
        self.time_label.configure(text=f"Tiempo: {tiempo:.1f} min")
        self.path_label.configure(text=f"Nodos en ruta: {num_nodos}")
        
        resultado_texto = (
            f"Algoritmo: Dijkstra\n"
            f"Iteraciones: {iterations}\n"
            f"Distancia: {distancia:.2f} km\n"
            f"Velocidad promedio: {avg_speed:.1f} km/h\n"
            f"Tiempo estimado: {tiempo:.1f} min\n"
            f"Nodos en la ruta: {num_nodos}\n"
        )
        self._actualizar_resultados(resultado_texto)
    
    def _limpiar(self):
        self.origin_node = self.destination_node = self.current_path = None
        self.origen_label.configure(text="No seleccionado")
        self.destino_label.configure(text="No seleccionado")
        self._set_estado("Selección limpiada.")
        self.dist_label.configure(text="Distancia: -- km")
        self.time_label.configure(text="Tiempo estimado: -- min")
        self.path_label.configure(text="Nodos en ruta: --")
        
        self._actualizar_resultados("Haz click en el mapa para seleccionar origen y destino.\n")
        
        if hasattr(self, 'map_canvas') and self.map_canvas.graph_drawn:
            self.map_canvas.delete("origin", "destination", "path", "path_node")
            self.map_canvas.current_path = None
            self.map_canvas._origin_node = self.map_canvas._destination_node = None
    
    def _actualizar_resultados(self, texto):
        self.resultados.configure(state="normal")
        self.resultados.delete("0.0", "end")
        self.resultados.insert("0.0", texto)
        self.resultados.configure(state="disabled")
    
    def _set_estado(self, texto):
        self.estado_label.configure(text=f"Estado: {texto}")
    
    def _resetear_vista(self):
        if hasattr(self, 'map_canvas') and self.map_canvas:
            self.map_canvas.zoom_level = 1.0
            self.map_canvas.reset_pan()
            self._set_estado("Vista reseteada.")


def main():
    ctk.set_appearance_mode(APPEARANCE_MODE)
    ctk.set_default_color_theme(COLOR_THEME)
    
    app = RutaMasCortaApp()
    app.mainloop()


if __name__ == "__main__":
    main()

