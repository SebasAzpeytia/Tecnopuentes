# Reglas de Desarrollo: UI y SEO

## 1. Estructura HTML y Semántica (SEO)
- **Evitar el uso excesivo de `<div>` y `<span>`**: Es una mala práctica construir layouts enteros usando únicamente estas etiquetas. 
- **Priorizar etiquetas semánticas**: Utiliza siempre que sea posible etiquetas HTML5 que describan el contenido (`<main>`, `<header>`, `<footer>`, `<section>`, `<article>`, `<nav>`, `<aside>`, `<p>`, `<h1>` al `<h6>`, etc.). Esto garantiza un código mucho más limpio, accesible y con un excelente rendimiento en SEO.

## 2. Tipografía y Emojis
- **No utilizar emojis en la interfaz gráfica**: Mantén un estilo profesional y limpio. Si requieres iconografía, utiliza librerías de íconos establecidas (como FontAwesome, Heroicons, etc.) o SVG nativos, pero bajo ninguna circunstancia uses emojis de texto en los componentes de la aplicación.

## 3. Listas y Viñetas
- **Usar etiquetas de listas nativas**: Cuando necesites enumerar elementos o crear viñetas, **nunca** utilices símbolos de texto como `•` o `-` incrustados directamente en divs o spans.
- **Estructura correcta**: Utiliza siempre las etiquetas `<ul>` (listas desordenadas) u `<ol>` (listas ordenadas), con sus respectivos hijos `<li>`. Si requieres un estilo visual distinto, aplica CSS sobre estas etiquetas semánticas en lugar de recrearlas con divs.
