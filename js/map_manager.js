class MapManager {
    constructor() {
        this.map = null;
        this.graph = new Graph();
        this.originMarker = null;
        this.destMarker = null;
        this.routeLine = null;
        this.bounds = null;

        this.initMap();
        this.setupEventListeners();
    }

    initMap() {
        // Inicializar el mapa centrado en Monterrey
        this.map = L.map('map').setView([25.6866, -100.3161], 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);
    }

    setupEventListeners() {
        this.map.on('click', (e) => this.handleMapClick(e));
        this.map.on('dblclick', () => this.clearSelection());
    }

    handleMapClick(e) {
        const latlng = e.latlng;
        
        if (!this.originMarker) {
            this.setOrigin(latlng);
        } else if (!this.destMarker) {
            this.setDestination(latlng);
            this.findRoute();
        }
    }

    setOrigin(latlng) {
        if (this.originMarker) {
            this.map.removeLayer(this.originMarker);
        }

        this.originMarker = this.createMarker(latlng, 'marker-origin');
        document.getElementById('origin-coords').textContent = 
            `${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`;
    }

    setDestination(latlng) {
        if (this.destMarker) {
            this.map.removeLayer(this.destMarker);
        }

        this.destMarker = this.createMarker(latlng, 'marker-destination');
        document.getElementById('dest-coords').textContent = 
            `${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`;
    }

    createMarker(latlng, className) {
        const icon = L.divIcon({
            className: `marker ${className}`,
            iconSize: [12, 12]
        });

        return L.marker(latlng, { icon }).addTo(this.map);
    }

    clearSelection() {
        if (this.originMarker) {
            this.map.removeLayer(this.originMarker);
            this.originMarker = null;
        }
        if (this.destMarker) {
            this.map.removeLayer(this.destMarker);
            this.destMarker = null;
        }
        if (this.routeLine) {
            this.map.removeLayer(this.routeLine);
            this.routeLine = null;
        }

        document.getElementById('origin-coords').textContent = 'No seleccionado';
        document.getElementById('dest-coords').textContent = 'No seleccionado';
        document.getElementById('route-info').innerHTML = 
            '<p>Selecciona un origen y un destino en el mapa</p>';
    }

    async findRoute() {
        if (!this.originMarker || !this.destMarker) return;

        const origin = this.originMarker.getLatLng();
        const destination = this.destMarker.getLatLng();

        try {
            const response = await fetch(
                `https://router.project-osrm.org/route/v1/driving/` +
                `${origin.lng},${origin.lat};${destination.lng},${destination.lat}` +
                '?overview=full&geometries=geojson'
            );

            const data = await response.json();

            if (data.routes && data.routes.length > 0) {
                const route = data.routes[0];
                this.displayRoute(route);
            }
        } catch (error) {
            console.error('Error al obtener la ruta:', error);
            document.getElementById('route-info').innerHTML = 
                '<p class="error">Error al calcular la ruta</p>';
        }
    }

    displayRoute(route) {
        if (this.routeLine) {
            this.map.removeLayer(this.routeLine);
        }

        this.routeLine = L.geoJSON(route.geometry, {
            style: {
                color: '#3b82f6',
                weight: 4,
                opacity: 0.8
            }
        }).addTo(this.map);

        // Ajustar el mapa para mostrar toda la ruta
        this.map.fitBounds(this.routeLine.getBounds(), {
            padding: [50, 50]
        });

        // Mostrar información de la ruta
        const distance = (route.distance / 1000).toFixed(2);
        const duration = Math.round(route.duration / 60);
        
        document.getElementById('route-info').innerHTML = `
            <p><strong>Distancia:</strong> ${distance} km</p>
            <p><strong>Tiempo estimado:</strong> ${duration} minutos</p>
        `;
    }
}