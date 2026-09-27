# Vista del Monitor

PENDIENTE DE DISEÑO (ver CONTEXT.md sección 5).

Cuando se diseñe, probablemente sea una versión condicional de los
componentes en `../anfitrion/`, mostrando/ocultando secciones según
`useSesionStore().permisos` (ver src/lib/permisos.ts).

No dupliques la UI de anfitrion/ — reutiliza los mismos componentes
con renderizado condicional por permiso.
