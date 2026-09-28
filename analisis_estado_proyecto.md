# Análisis de Estado: Proyecto TecnoPuentes

Hasta este punto, hemos completado con éxito la **Fase de Maquetación UI (Frontend estático)** y la **Lógica de Enrutamiento base**. Tenemos una aplicación que "se ve" completa y fluye de pantalla en pantalla, pero que internamente sigue operando con **datos de prueba (Mocks)** en la mayoría de sus vistas.

A continuación, detallo qué tenemos listo y qué funcionalidades "invisibles" faltan conectar a la base de datos (Supabase) antes de poder construir el sistema de juegos.

---

## ✅ 1. Lo que ya está construido (Completado)

*   **Autenticación y Sesión:**
    *   Registro e inicio de sesión con correo y contraseña.
    *   Guardado seguro del usuario en el estado global (`Zustand`).
    *   Cierre de sesión funcional.
*   **Enrutamiento Inteligente (Route Guards):**
    *   Redirección automática dependiendo del rol (`residente`, `monitor` o `anfitrion`).
    *   Protección para que los roles no puedan acceder a pantallas que no les corresponden.
*   **UI del Residente (100% Maquetada):**
    *   Inicio (lista de juegos).
    *   Actividad (estadísticas semanales e historial).
    *   Chat (pantalla de mensajes).
    *   Perfil y sub-pantallas (Mi información, Contraseña, Notificaciones, Ayuda).
*   **UI del Anfitrión/Monitor (100% Maquetada):**
    *   Panel Dashboard (estadísticas generales y alertas).
    *   Miembros y Agregar miembro (modal de expulsar y selector de roles).
    *   Personalización (acordeón de juegos y editor de Canvas/Emojis).
    *   Reportes (historial y botón de generar).
    *   *Exclusivo Anfitrión:* Gestión de monitores y permisos personalizados.

---

## 🚧 2. Funcionalidades faltantes (El "Cerebro" de la App)

Todas las pantallas mencionadas arriba tienen datos "quemados" (estáticos) en el código. Falta construir la lógica que las conecte con Supabase. 

### A. Gestión del Asilo y Usuarios
*   **Creación y Unión a Asilos:**
    *   Generar un **código único** alfanumérico cuando el Anfitrión registra un asilo.
    *   Lógica para que el Residente valide ese código en `/ingresar-codigo` y se inserte en la tabla `asilo_miembros`.
*   **Gestión de Miembros (Panel del Anfitrión):**
    *   Leer la lista real de miembros de Supabase y mostrarlos en `/panel/miembros`.
    *   Implementar la función real del botón "Expulsar usuario" (borrar de `asilo_miembros`).
    *   Generar los códigos de invitación para monitores (`/panel/invitar-monitor`).

### B. El Chat
*   **Tabla de Mensajes:** Crear una tabla en Supabase (ej. `chat_mensajes`).
*   **Tiempo real:** Configurar la suscripción a Supabase (WebSockets) para que cuando un residente envíe un mensaje, aparezca instantáneamente en las pantallas de los demás.

### C. Sistema de Permisos de Monitores
*   La pantalla de "Invitar Monitor" tiene los *switches* de permisos, pero necesitamos una tabla o columna en Supabase (ej. `permisos` tipo JSON en `asilo_miembros`) para guardar qué puede hacer cada monitor.

### D. Subida de Archivos (Storage)
*   **Foto de perfil:** En `/perfil/informacion` el residente debería poder subir una foto.
*   **Personalización:** En `/panel/personalizar/editar`, la opción de "Subir imagen" requiere conectarse a Supabase Storage (Buckets) para guardar las fotos de los iconos de los juegos.

---

## 📋 3. ¿Qué necesitamos ANTES de hacer el sistema de juegos?

Si nos saltamos directo a los juegos, no tendríamos dónde guardar los resultados reales ni cómo personalizar el juego de manera dinámica. Recomiendo que ataquemos estos puntos primero:

1.  **Terminar el Flujo de Unión (Códigos):**
    *   Asegurar que un Residente nuevo pueda usar un código real y entrar a un Asilo real en la base de datos.
2.  **Conectar la Base de Datos al `Home` del Residente:**
    *   Lograr que la aplicación sepa *quién* es el usuario y lea el nombre real del asilo para mostrarlo en pantalla.
3.  **Preparar la Personalización (Base de datos):**
    *   Crear la tabla `juegos_personalizacion` en Supabase. Si un Anfitrión decide que el Memorama use un 🐶 en lugar de una 🌸, la lógica del juego (cuando la construyamos) debe poder descargar esta configuración desde la base de datos antes de iniciar la partida.

## Conclusión

El proyecto está excelentemente estructurado a nivel visual. Para que "cobre vida", necesitamos reemplazar los `useState` estáticos con llamadas a la API de `supabase`. 

Mi recomendación táctica es **no hacer todas las conexiones de golpe**, sino elegir el flujo principal (Unirse a un asilo -> Cargar el Home -> Personalizar 1 ícono) y hacerlo funcional de inicio a fin. Luego de eso, el desarrollo del motor de juegos será mucho más fácil.
