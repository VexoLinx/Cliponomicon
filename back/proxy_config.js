// Front/Cliponomicon/back/proxy_config.js

/**
 * Capa de Proxy y Configuración de Conectividad.
 * 
 * Este fichero establece los parámetros necesarios para la comunicación con la API,
 * centralizando la URL base y las configuraciones de CORS requeridas para el fetch.
 * Sirve como punto de configuración para el `api_client.js`.
 */

export const PROXY_CONFIG = {
    // URL base centralizada
    BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',

    // Configuración predeterminada para peticiones CORS
    FETCH_OPTIONS: {
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }
};

/**
 * Helper para inyectar el token de autorización si está disponible.
 */
export const getAuthHeaders = (token) => {
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};
