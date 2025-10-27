# Proyecto Final - Lenguajes Formales y Autómatas

Suite de herramientas computacionales para análisis lógico, procesamiento de patrones y algoritmos de grafos.

## Proyectos Incluidos

### 1. Reducción Booleana
Herramienta interactiva para simplificar expresiones lógicas booleanas con visualización paso a paso.

### 2. Evaluador Regex
Aplicación Flutter para validar y probar expresiones regulares en tiempo real.

### 3. Tablas de Verdad
Juego educativo interactivo para practicar lógica proposicional (Unity WebGL).

### 4. Algoritmo de Dijkstra
Visualizador de rutas óptimas usando OpenStreetMap.

## Cómo ejecutar localmente

### Opción 1: Live Server (Recomendado - VS Code)
1. Instala la extensión "Live Server" en VS Code
2. Click derecho en `index.html` > "Open with Live Server"
3. El sitio se abrirá automáticamente en el navegador

### Opción 2: Servidor Python
```bash
python -m http.server 5500
```
Luego visita: `http://localhost:5500`

### Opción 3: Cualquier servidor HTTP
El proyecto es estático y funciona con cualquier servidor HTTP básico.

## Despliegue

### GitHub Pages (Recomendado)
El proyecto está listo para GitHub Pages. Los archivos Unity han sido descomprimidos para compatibilidad.

1. Sube el proyecto a GitHub
2. Ve a Settings > Pages
3. Selecciona la rama `main` como fuente
4. El sitio estará disponible en `https://tu-usuario.github.io/nombre-repo`

### Netlify / Vercel
También compatible con Netlify y Vercel. Simplemente conecta el repositorio y despliega automáticamente.

**Nota**: El archivo `.nojekyll` asegura que GitHub Pages no ignore carpetas con guiones.

## Estructura del Proyecto

```
.
├── index.html                      # Página principal
├── favicon.ico                     # Icono del sitio
├── styles.css                      # Estilos globales
├── .nojekyll                       # Archivo para GitHub Pages
├── .gitignore                      # Archivos ignorados
├── README.md                       # Documentación
│
├── Reduccion-Booleana-main/        # Reducción Booleana
│   ├── index.html
│   ├── styles.css
│   └── js/                         # Lógica de simplificación
│
├── evaluador-regex/                # Evaluador Regex (Flutter)
│   ├── index.html
│   ├── main.dart.js
│   ├── flutter_bootstrap.js
│   └── assets/                     # Recursos Flutter
│
├── tablas/                         # Tablas de Verdad (Unity WebGL)
│   ├── index.html
│   ├── Build/                      # Archivos Unity descomprimidos
│   └── TemplateData/               # Recursos Unity
│
├── mapa.html                       # Algoritmo de Dijkstra
├── regex.html                      # Wrapper para evaluador regex
├── styles/
│   └── mapa.css                    # Estilos del mapa
└── js/
    ├── graph.js                    # Implementación de grafos
    ├── map_manager.js              # Gestión del mapa
    └── route_finder.js             # Algoritmo de Dijkstra
```

## Tecnologías

- HTML5, CSS3, JavaScript
- Flutter (WebAssembly)
- Unity WebGL
- OpenStreetMap + Leaflet.js
- Algoritmo de Dijkstra

## Autor

Proyecto Final - Lenguajes Formales y Autómatas
© 2025

