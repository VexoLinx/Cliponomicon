# TODO de revision del proyecto

Revision hecha ignorando `Api_puente`. El objetivo de este documento es dejar una lista accionable de problemas tecnicos, mala organizacion y mejoras de modularidad detectadas en el frontend.

Leyenda:
- `[x]` hecho
- `[~]` parcialmente hecho
- `[ ]` pendiente

## Decisiones API confirmadas

- `POST /auth/login` funciona actualmente con JSON desde el frontend; no cambiarlo por OAuth form hasta que el backend lo pida explicitamente.
- Las URLs de media (`/videos/{id}/thumbnail`, `/videos/{id}/stream`, `/clip/{id}`) se tratan como publicas desde el frontend. Si hay contenido privado, lo decide el backend.
- `edited` es un metadato del video, no un `variant_type`. El frontend debe usar las variantes que lleguen en `video.variants`.
- La forma correcta actual de informar al frontend de variantes disponibles es el campo `variants` de cada `VideoDetailResponse`. Si en el futuro hace falta poblar menus antes de tener un video, crear un endpoint explicito tipo `GET /videos/variant-types`.
- Avatar queda fuera de alcance por ahora.
- Los endpoints `admin` no pertenecen a este frontend y quedan explicitamente fuera de la capa API de esta app.
- La busqueda `#tag` queda bloqueada hasta que backend exponga un endpoint para buscar/resolver tags por texto o id y devolver el `tag_id`.

## Prioridad alta: errores y riesgos funcionales

1. [x] ~~**Instalar y fijar dependencias de desarrollo**~~
   - `npm run lint` y `npm run build` fallan porque no existen los binarios locales `eslint` y `vite`.
   - Accion: ejecutar `npm install` o `npm ci`, confirmar que se crea `node_modules`, y despues volver a ejecutar `npm run lint` y `npm run build`.
   - Estado: hecho. `npm ci`, `npm run lint` y `npm run build` pasan correctamente.
   - Archivos relacionados: `package.json`, `package-lock.json`.

2. [x] ~~**Arreglar la codificacion de textos**~~
   - Habia mojibake visible en muchos textos de la app y documentacion.
   - Tambien `README.md` parece contener caracteres nulos o codificacion rota.
   - Accion: normalizar archivos a UTF-8 sin BOM y corregir textos visibles, comentarios y README.
   - Estado: hecho para los textos con mojibake detectables en `src`; `README.md` fue reemplazado por documentacion limpia en UTF-8/ASCII.

3. [x] ~~**Unificar eventos de autenticacion**~~
   - Accion: definir una constante unica de evento, por ejemplo `AUTH_EXPIRED_EVENT`, y usarla en toda la app.
   - Estado: hecho a nivel de capa API activa. `src/services/api/http.js` centraliza el 401 y emite `auth-expired`; la antigua carpeta `back` fue eliminada.

4. [x] ~~**No calcular permisos de edicion desde textos de UI**~~
   - Estado: hecho en `src/components/videos/GlobalVideoModal/useGlobalVideoModal.js`; ahora usa `can_edit`, `can_delete` e `is_owner`.

5. [x] ~~**Revisar URLs incorrectas o inconsistentes**~~
   - En `VideoCard`, el fallback de copiar enlace usa `/games/${targetVideoId}`, pero esa ruta espera un `categoryId`, no un video.
   - Algunas URLs usan `import.meta.env.VITE_API_URL` sin fallback y otras usan `|| ""`.
   - Accion: crear helpers centralizados para rutas publicas y endpoints API.
   - Estado: hecho. `.env.example` y `docker-compose.yml` apuntan a la API real directa; las URLs de clip/stream/thumbnail salen de `src/services/api`.
   - Nota: la busqueda `#tag` queda esperando endpoint backend para resolver texto a `tag_id`.
   - Archivos: `src/components/videos/VideoCard/VideoCard.jsx`, `src/components/videos/GlobalVideoModal/GlobalVideoModal.jsx`, hooks con `VITE_API_URL`.

6. [x] ~~**Corregir dependencias de hooks y posibles closures obsoletos**~~
   - Hay funciones async declaradas dentro de hooks y usadas en efectos sin `useCallback`, con dependencias incompletas.
   - Ejemplos: `useLogin` llama `handleSSOCallback` desde `useEffect`; `useFavoritesVideos` registra listeners que cierran sobre versiones antiguas de `fetchFavorites`; `useHomeVideos` recrea `loadVideos` en cada render.
   - Estado: hecho en los hooks principales de login, home, favoritos y detalle de juego.

7. [x] ~~**Evitar leaks de object URLs en subida**~~
   - Estado: hecho en `src/components/videos/VideoUploader/useVideoUpload.js`.

## Prioridad alta: arquitectura y modularidad

8. [x] ~~**Decidir si existe una capa API real**~~
   - Antes existia una carpeta `back` con un cliente API no usado por la app.
   - En la practica casi todo `src` usaba `fetch` directo.
   - Accion: mover la capa API a `src/services/api` o `src/lib/api`, actualizar imports y eliminar `fetch` directo de componentes/hooks.
   - Resultado esperado: auth, errores 401, headers, JSON/FormData, base URL y mapeo se manejan en un unico sitio.
   - Estado: hecho. `fetch` y `apiRequest` quedan centralizados en `src/services/api`; los componentes/hooks consumen servicios por dominio.

9. [x] ~~**Separar DTOs de modelos de UI**~~
   - Habia varios mappers manuales e incompatibles para videos: `mapApiVideoToCard` en Home, otro en GameDetail, mas normalizacion en `VideoCard`.
   - Accion: crear `video.mapper.js` con funciones tipo `mapVideoDtoToCard`, `mapVideoDtoToModal`, `getVideoThumbnailUrl`, `getVideoStreamUrl`.
   - Estado: hecho para entidades no-admin. Existen mappers de video, user, category, tag, steam e interactions en `src/services/mappers`.

10. [x] ~~**Extraer servicios por dominio**~~
    - Ahora las pantallas saben demasiados endpoints.
    - Accion: crear servicios: `authService`, `videoService`, `categoryService`, `favoriteService`, `userService`, `steamService`.
    - Beneficio: menos duplicacion de headers, errores, paginacion y eventos.
    - Estado: hecho con `src/services/api/auth.api.js`, `videos.api.js`, `videoMedia.api.js`, `categories.api.js`, `interactions.api.js`, `users.api.js`, `tags.api.js`, `steam.api.js` y `health.api.js`.

11. [ ] **Sustituir eventos globales por un bus tipado o estado compartido claro**
    - Se usan eventos de `window`: `videos-changed`, `video-updated`, `video-deleted`, `favorites-changed`, `categories_updated`, `auth-expired`.
    - Son dificiles de rastrear, no tienen tipado, mezclan `snake_case` y kebab-case y acoplan componentes lejanos.
    - Accion: centralizar nombres en `src/events/appEvents.js` como minimo; idealmente usar context/reducer o una libreria de cache/query.

12. [ ] **Dividir componentes grandes**
    - `SettingsPage.jsx`, `VideoUpdateModal.jsx`, `GlobalVideoModal/useGlobalVideoModal.js`, `VideoCard.jsx` y `CustomVideoPlayer` mezclan presentacion, datos, permisos, efectos y acciones.
    - Accion: dividir por responsabilidad: secciones visuales, formularios, hooks de datos, servicios API y componentes puros.

13. [x] ~~**Eliminar la carpeta `back` obsoleta**~~
    - Estado: hecho. La capa activa vive en `src/services/api` y los mappers en `src/services/mappers`.

## Prioridad media: datos, errores y estados

14. [x] ~~**Centralizar manejo de errores HTTP**~~
    - Cada `fetch` parsea errores de forma distinta. Algunos hacen `response.json()` sin protegerse ante respuestas vacias.
    - Accion: helper `request()` que maneje 204, JSON invalido, blobs, errores FastAPI `detail`, 401 y AbortError.
    - Estado: hecho con `apiRequest` y `parseApiError` en `src/services/api/http.js`.

15. [ ] **No guardar auth solo como token booleano**
    - `isAuthenticated` es `!!token`; si `userData` esta corrupto o el token no contiene `exp`, la app puede quedar en estado incoherente.
    - Accion: validar token y usuario juntos, manejar `JSON.parse` de `userData` con try/catch y limpiar estado si esta corrupto.
    - Archivo: `src/context/AuthContext/useAuthProviderState.js`.

16. [ ] **Revisar almacenamiento de token en `localStorage`**
    - Guardar JWT en `localStorage` aumenta exposicion ante XSS.
    - Accion: si el backend lo permite, preferir cookie httpOnly. Si no, reforzar sanitizacion, CSP y expiracion.

17. [~] **Normalizar paginacion**
    - `LIMIT = 20` se repite. `hasMore` se calcula por `items.length === LIMIT`, ignorando `total` si existe.
    - Accion: crear hook reusable `usePaginatedVideos` o helper de paginacion que use `total/offset/limit` cuando el backend lo devuelva.
    - Estado: parcialmente hecho en Home, Favoritos y GameDetail; ahora usan `total`. Falta extraer un hook reutilizable.

18. [ ] **Evitar polling por tarjeta**
    - `useVideoData` crea un `setInterval` por cada tarjeta en procesamiento.
    - En una grid grande puede provocar muchas llamadas simultaneas a `/videos/:id`.
    - Accion: mover polling a un coordinador por lista o usar una consulta agrupada.

19. [ ] **Abortar peticiones en mas hooks**
    - Algunos hooks usan `AbortController`, otros no.
    - Accion: aplicar cancelacion consistente en `GamesPage`, `FavoritesPage`, `GameDetailPage`, `GlobalVideoModal`, `SettingsPage` y busquedas Steam.

20. [ ] **Evitar `alert` y `window.confirm`**
    - Hay `alert`/`confirm` para favoritos, validacion de upload, avatar y borrado de videos.
    - Accion: usar modales/toasts propios y accesibles, con estados controlados.

## Prioridad media: UI, accesibilidad y consistencia

21. [ ] **Arreglar textos visibles rotos antes de pulir UI**
    - El mojibake esta en labels, botones, placeholders y mensajes de error.
    - Accion: corregir contenido visible y despues revisar que no haya overflow en botones y modales.

22. [ ] **Agregar atributos accesibles a botones de icono**
    - Botones como cerrar, copiar enlace, favorito y toggles de password dependen de iconos o title.
    - Accion: agregar `aria-label`, estados `aria-pressed` donde aplique y foco visible.

23. [ ] **Revisar portales y cierre de modales**
    - Los modales se cierran por click en overlay, pero no se ve manejo de tecla Escape ni bloqueo de scroll/foco.
    - Accion: crear un componente base `Modal` con foco atrapado, Escape, overlay, scroll lock y portal.

24. [ ] **Unificar estilos compartidos**
    - Hay CSS global compartido en `src/components/videos/videos.css` y CSS especifico por componente, con riesgo de colisiones como `.modal-overlay`, `.modal-content`, `.sidebar-footer-video`.
    - Accion: adoptar CSS Modules, BEM consistente o prefijos por componente.

25. [ ] **Evitar placeholders externos en runtime**
    - Se usan `via.placeholder.com`, `placehold.co` y `ui-avatars.com`.
    - Accion: tener placeholders locales o generarlos desde CSS para que la UI no dependa de terceros.

## Prioridad media: configuracion y despliegue

26. [x] ~~**Documentar variables de entorno reales**~~
    - `.env.example` solo contiene una variable minima y el README principal sigue siendo el de plantilla Vite.
    - Estado: hecho en `.env.example` y `README.md`.

27. [x] ~~**Revisar mismatch de puertos y URLs**~~
    - `docker-compose.yml` compila con `VITE_API_URL=${API_URL:-http://localhost:3000/api}`, mientras el servicio frontend expone `${APP_PORT:-8000}:80`.
    - Estado: hecho. El frontend apunta directo a la API real y `docker-compose.yml` ya no levanta `api-puente`.

28. [ ] **Excluir carpetas innecesarias del build Docker**
    - El Dockerfile hace `COPY . .`, lo que puede copiar docs, carpetas auxiliares y posiblemente `Api_puente`.
    - Accion: revisar `.dockerignore` y asegurar que `Api_puente`, archivos locales y artefactos no entren en el build del frontend si no hacen falta.

29. [x] ~~**Actualizar README principal**~~
    - Ahora mantiene texto de plantilla Vite y duplicados corruptos de `Cliponomicon`.
    - Estado: hecho.

## Prioridad baja: limpieza y consistencia

30. [~] **Eliminar o aislar `ApiTester`**
    - `ApiTester` se puede activar desde Settings y no parece una feature de usuario.
    - Accion: mover a `src/devtools`, cargar solo en desarrollo o proteger por `import.meta.env.DEV`.
    - Estado: parcialmente hecho. Ya usa `src/services/api`, pero sigue disponible desde Settings.

31. [ ] **Unificar nombres de eventos**
    - Hay mezcla de `categories_updated` con `videos-changed`.
    - Accion: elegir kebab-case o snake_case y documentarlo.

32. [x] ~~**Unificar nombres de campos**~~
    - Se mezclan `is_registered_only`, `isRegisteredOnly`, `processing_status`, `processingStatus`, `gameIcon`, `thumbnail_horizontal_url`.
    - Accion: convertir DTOs del backend a un modelo interno unico al entrar en la app.
    - Estado: hecho para entidades no-admin mediante `src/services/mappers`.

33. [ ] **Revisar imports innecesarios**
    - Tras instalar dependencias, correr ESLint para detectar imports/variables sin uso. Ejemplo probable: `ApiTester` importado en `SettingsPage.jsx` pero no usado directamente.

34. [ ] **Evitar logs de desarrollo en produccion**
    - Hay muchos `console.log`, `console.warn` y `console.error` con mensajes internos.
    - Accion: crear logger condicionado por entorno o eliminar logs de debug.

35. [ ] **Crear tests minimos**
    - No hay setup de tests.
    - Accion: agregar tests para mappers, cliente API, auth provider, permisos de edicion y paginacion.

36. [ ] **Revisar assets pesados**
    - Hay videos e imagenes grandes dentro de `src/assets`.
    - Accion: confirmar si deben empaquetarse en el bundle. Si son demo/media, mover a `public` o almacenamiento externo.

## Orden recomendado de trabajo

1. Restaurar dependencias y conseguir que `npm run lint` y `npm run build` corran.
2. Corregir codificacion UTF-8 y README.
3. Reemplazar eventos globales por constantes y luego por estado/cache mas mantenible.
4. Dividir modales, settings y video card en componentes/hooks mas pequenos.
5. Mejorar accesibilidad de modales, botones de icono y confirmaciones.
6. Documentar setup local, Docker y variables de entorno.
