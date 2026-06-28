// Front/Cliponomicon/back/proxy_config.js

/**
 * Capa de Proxy y Configuración de Conectividad.
 * 
 * Este fichero establece los parámetros necesarios para la comunicación con la API,
 * centralizando la URL base y las configuraciones de CORS requeridas para el fetch.
 * Sirve como punto de configuración para el `api_client.js`.
 */

const PROXY_CONFIG = {
    // URL base centralizada
    BASE_URL: process.env.VITE_API_URL || 'http://localhost:8000',

    // Configuración predeterminada para peticiones
    DEFAULT_HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
};

/**
 * Helper para inyectar el token de autorización de forma dinámica.
 */
const getAuthHeaders = (token) => {
    return {
        ...PROXY_CONFIG.DEFAULT_HEADERS,
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

module.exports = {
    PROXY_CONFIG,
    getAuthHeaders,
};