# Ruta más corta — Visualizador OSMnx

Aplicación de escritorio (CustomTkinter) para cargar un grafo de carreteras usando OSMnx y calcular la ruta más corta entre dos nodos usando Dijkstra. La interfaz permite seleccionar origen y destino en un canvas interactivo, hacer zoom/pan y visualizar la ruta calculada junto con estadísticas (distancia, tiempo estimado, velocidad promedio).

## Contenido del repositorio

- `main.py` — Aplicación principal y UI (CustomTkinter).
- `canvas_mapa.py` — Canvas personalizado que dibuja el grafo, maneja zoom/pan y resalta rutas.
- `grafo_manager.py` — Carga y preprocesa el grafo con OSMnx; implementa Dijkstra y reconstrucción de ruta.
- `config.py` — Variables de configuración (colores, parámetros de zoom, ajustes de UI, lugar por defecto).
- `cache/` — Archivos JSON de cache (no versionados seguramente).

## Requisitos

- Python 3.8+ (se recomienda 3.10 o 3.11).
- Paquetes listados en `requirements.txt` (ver sección "Instalación").
- Conexión a Internet para descargar los datos de OpenStreetMap cuando se carga por primera vez el grafo.

Nota: OSMnx y sus dependencias requieren paquetes del ecosistema geoespacial (GEOS, GDAL, Fiona, Pyproj). En Windows puede ser más sencillo instalar estas dependencias usando conda o ruedas precompiladas.

## Instalación (Windows, PowerShell)

1. Crear y activar un entorno virtual (recomendado):

```powershell
python -m venv .venv; .\.venv\Scripts\Activate.ps1
```

2. Actualizar pip y setuptools:

```powershell
python -m pip install --upgrade pip setuptools wheel
```

3. Instalar las dependencias desde `requirements.txt`:

```powershell
pip install -r requirements.txt
```

Si tienes problemas con paquetes geoespaciales en Windows, instala primero usando conda (recomendado):

```powershell
# usando conda (Anaconda/Miniconda)
conda create -n ruta-env python=3.10 -y; conda activate ruta-env
conda install -c conda-forge osmnx geopandas gdal fiona pyproj rtree -y
pip install customtkinter
```

## Uso

1. Abrir una terminal (PowerShell) y activar el entorno virtual.
2. Ejecutar la aplicación:

```powershell
python main.py
```

3. La ventana mostrará el mapa (se carga el grafo del lugar configurado en `config.py`, por defecto `La Esperanza, Guatemala`).
4. Instrucciones rápidas en la UI:
   - Click izquierdo: seleccionar nodo (primero origen, luego destino).
   - Click derecho o medio + arrastrar: mover el mapa.
   - Rueda del ratón: zoom.
   - Botón "Calcular ruta": ejecuta Dijkstra y dibuja la ruta.
   - "Resetear vista" y "Limpiar selección" disponibles en la barra lateral.

## Configuración

Ajusta parámetros en `config.py`:

- `PLACE_NAME`: nombre del lugar a cargar con OSMnx.
- Apariencia: `APPEARANCE_MODE`, `COLOR_THEME`.
- Parámetros de canvas: `CANVAS_PADDING`, `NODE_RADIUS`, `ZOOM_*`.
- `DEFAULT_SPEED`: velocidad por defecto usada para estimar tiempos.

## Limitaciones y notas técnicas

- El algoritmo de Dijkstra implementado recorre el grafo usando la estructura interna de OSMnx. El código asume aristas direccionadas con índices de clave `(u, v, 0)`; para grafos con múltiples claves/atributos puede ser necesario adaptar el acceso.
- El proyecto no modifica ni guarda el grafo en disco (salvo potencial cache interna de la librería OSMnx). Si necesitas persistir el grafo, considera serializar con `ox.save_graphml`.
- En grafos grandes la carga y el cálculo de rutas pueden ser lentos. Para ciudades grandes usa bounding boxes más pequeñas o subgrafos.

## Solución de problemas comunes

- Error al instalar `geopandas`, `osmnx` o `gdal`: instalar dependencias binarias con conda o usar ruedas precompiladas.
- Tiempo largo en `Grafo cargado`: verifica la conexión a Internet y reduce el área solicitada en `PLACE_NAME`.
- Ventana vacía o canvas sin nodos: asegúrate de que la carga del grafo terminó (estado en la barra lateral), y prueba hacer zoom/pan.

## Desarrollo y pruebas

- El código está estructurado para ser legible y fácilmente extendible.
- Para añadir pruebas unitarias: recomendaría extraer la lógica de Dijkstra a funciones puras y agregar tests con `pytest`.

## Licencia

Este repositorio incluye una licencia MIT (archivo `LICENSE`).

## Contacto

Si necesitas ayuda o quieres contribuir, abre un issue en el repositorio o contacta al autor del proyecto.
