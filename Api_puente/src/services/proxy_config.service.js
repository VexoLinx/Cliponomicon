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
    BASE_URL: process.env.API_EXTERNA_URL,

    // Configuración predeterminada para peticiones CORS
    FETCH_OPTIONS: {
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${process.env.API_TOKEN || ''}`
        }
    }
};

/**
 * Helper para inyectar el token de autorización si está disponible.
 */
// const getAuthHeaders = (token) => {
//     return token ? { 'Authorization': `Bearer ${token}` } : {};
// };

module.exports = {
    PROXY_CONFIG,
};
