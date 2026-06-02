import { PROXY_CONFIG, getAuthHeaders } from './proxy_config.js';
import { mapUserDTO, mapSteamGameDTO, mapVideoDTO } from './mappers.js';

class SpiderShareClient {

    constructor(baseUrl = PROXY_CONFIG.BASE_URL) {
        this.baseUrl = baseUrl;
        this.token = localStorage.getItem('token') || null;
        this.listeners = [];
    }

    /**
     * @callback AuthListener
     * @param {boolean} isAuthenticated
     */
    /**
     * @param {AuthListener} callback 
     * @returns {Function} Unsubscribe function
     */
    subscribe(callback) {
        this.listeners.push(callback);
        return () => this.listeners = this.listeners.filter(cb => cb !== callback);
    }

    // Alias legacy para evitar romper código existente con errores ortográficos
    suscribe(callback) {
        return this.subscribe(callback);
    }

    notify() {
        this.listeners.forEach(callback => callback(!!this.token));
    }

    /**
     * @param {string|null} token 
     */
    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
        this.notify();
    }

    async _request(endpoint, options = {}) {
        const isFormData = options.body instanceof FormData;
        
        // Creamos una copia limpia de las cabeceras base configuradas
        const headers = {
            ...PROXY_CONFIG.FETCH_OPTIONS.headers
        };

        // Si enviamos un archivo binario/multipart (FormData), dejamos que el navegador
        // maneje el Content-Type y añada el límite (boundary) correcto automáticamente
        if (isFormData) {
            delete headers['Content-Type'];
        }

        Object.assign(headers, getAuthHeaders(this.token));

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                mode: PROXY_CONFIG.FETCH_OPTIONS.mode || 'cors',
                ...options,
                headers,
            });

            if (response.status === 401) {
                this.logout();
                window.dispatchEvent(new CustomEvent('onUnauthorized'));
                throw new Error('No autorizado - Inicia sesión nuevamente');
            }

            if (!response.ok) {
                const error = await response.json().catch(() => ({ detail: 'Error en la petición' }));
                
                // Si es un error de validación estructurado de FastAPI (422)
                if (Array.isArray(error.detail)) {
                    const errorMessages = error.detail
                        .map(err => {
                            const field = err.loc ? err.loc.join('.') : 'campo';
                            return `${field}: ${err.msg}`;
                        })
                        .join(', ');
                    throw new Error(`Error de validación: ${errorMessages}`);
                }
                
                throw new Error(error.detail || 'Error en la petición');
            }

            if (response.status === 204) return null;

            const contentType = response.headers.get('content-type');
            if (contentType && (contentType.includes('application/octet-stream') || contentType.includes('video/') || contentType.includes('image/'))) {
                return await response.blob();
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }


    // AUTH
    async register(username, password) {
        return await this._request(`/auth/register`, {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
    }

    async login(username, password) {
        const data = await this._request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
        if (data.access_token) this.setToken(data.access_token);
        return mapUserDTO(data);
    }

    logout() {
        this.setToken(null);
    }

    /**
     * @returns {Promise<Object>}
     */
    async getMe() {
        const data = await this._request('/auth/me');
        return mapUserDTO(data);
    }

    // USERS
    /**
     * @returns {Promise<Array>}
     */
    async listUsers() {
        const data = await this._request('/users');
        return Array.isArray(data) ? data.map(mapUserDTO) : [];
    }

    /**
     * @param {string} userId 
     * @returns {Promise<Object>}
     */
    async getUser(userId) {
        const data = await this._request(`/users/${userId}`);
        return mapUserDTO(data);
    }

    async patchUser(userId, data = {}) {
        const responseData = await this._request(`/users/${userId}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
        return mapUserDTO(responseData);
    }

    async deleteUser(userId) {
        return await this._request(`/users/${userId}`, {
            method: 'DELETE',
        });
    }

    // USERS-->AVATAR
    /**
     * Sube un archivo de imagen como avatar del usuario.
     * @param {string} userId 
     * @param {File|Blob} avatarFile 
     * @returns {Promise<Object>} Mapped user data
     */
    async putAvatar(userId, avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);

        const data = await this._request(`/users/${userId}/avatar`, {
            method: 'PUT',
            body: formData,
        });
        return mapUserDTO(data);
    }

    async deleteAvatar(userId) {
        const data = await this._request(`/users/${userId}/avatar`, {
            method: 'DELETE',
        });
        return mapUserDTO(data);
    }

    async getAvatar(userId) {
        return await this._request(`/users/${userId}/avatar`, {
            method: 'GET',
        });
    }

    // USERS-->PASSWORD
    /**
     * Cambia la contraseña del usuario.
     * @param {string} userId 
     * @param {string} newPassword 
     * @param {string|null} [currentPassword] 
     */
    async changePassword(userId, newPassword, currentPassword = null) {
        const payload = {
            new_password: newPassword
        };
        if (currentPassword) {
            payload.current_password = currentPassword;
        }

        return await this._request(`/users/${userId}/password`, {
            method: 'PATCH',
            body: JSON.stringify(payload),
        });
    }

    // STEAM
    /**
     * @param {string} steamIdOrVanity 
     * @returns {Promise<Array>}
     */
    async getSteamGames(steamIdOrVanity) {
        const data = await this._request(`/steam/users/${steamIdOrVanity}/games`);
        if (data && data.games && Array.isArray(data.games)) {
            return data.games.map(mapSteamGameDTO);
        }
        return [];
    }

    //VIDEO
    /**
     * @param {File} file
     * @param {string} title 
     * @param {string} description
     * @param {boolean} is_registered_only
     * @param {Array<string>} category_ids
     * @param {Array<string>} tags
     * @returns {Promise<Object>}
     */
    async postVideo(file, title, description, is_registered_only = false, category_ids = [], tags = []) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('is_registered_only', is_registered_only);
        
        category_ids.forEach(id => formData.append('category_ids', id));
        tags.forEach(tag => formData.append('tags', tag));

        const data = await this._request('/videos', {
            method: 'POST',
            body: formData,
        });
        return mapVideoDTO(data);
    }

    /**
     * Obtiene el listado de videos con soporte para filtros y paginación.
     * @param {Object} [params]
     * @param {string} [params.title]
     * @param {Array<string>} [params.tags]
     * @param {Array<string>} [params.category_ids]
     * @param {string} [params.owner_id]
     * @param {number} [params.limit]
     * @param {number} [params.offset]
     * @returns {Promise<Object>} Object containing items (mapped), total, limit, offset
     */
    async getVideos({ title, tags, category_ids, owner_id, limit = 20, offset = 0 } = {}) {
        const params = new URLSearchParams();
        if (title) params.append('title', title);
        if (limit !== undefined) params.append('limit', limit);
        if (offset !== undefined) params.append('offset', offset);
        if (owner_id) params.append('owner_id', owner_id);
        
        if (tags && Array.isArray(tags)) {
            tags.forEach(tag => params.append('tags', tag));
        }
        if (category_ids && Array.isArray(category_ids)) {
            category_ids.forEach(id => params.append('category_ids', id));
        }
        
        const queryString = params.toString();
        const endpoint = queryString ? `/videos?${queryString}` : '/videos';
        
        const data = await this._request(endpoint);
        
        return {
            items: data && data.items ? data.items.map(mapVideoDTO) : [],
            total: (data && data.total) || 0,
            limit: (data && data.limit) || limit,
            offset: (data && data.offset) || offset
        };
    }

    /**
     * @param {string} video_id 
     * @returns {Promise<Object>}
     */
    async getVideo(video_id) {
        const data = await this._request(`/videos/${video_id}`);
        return mapVideoDTO(data);
    }

    async patchVideo(video_id, data = {}) {
        const responseData = await this._request(`/videos/${video_id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
        return mapVideoDTO(responseData);
    }   
    
    async deleteVideo(video_id) {
        return await this._request(`/videos/${video_id}`, {
            method: 'DELETE',
        });
    }

    async downloadVideo(video_id) {
        const blob = await this._request(`/videos/${video_id}/download`, {
            method: 'GET',
        });
        return blob;
    }

    async streamVideo(video_id, variant_type = 'low_h264') {
        const blob = await this._request(`/videos/${video_id}/stream?variant_type=${variant_type}`, {
            method: 'GET',
        });
        return blob;
    }

    async getVideoThumbnail(video_id) {
        const blob = await this._request(`/videos/${video_id}/thumbnail`, {
            method: 'GET',
        });
        return blob;
    }

    async postFavoriteVideo(video_id) {
        return await this._request(`/videos/${video_id}/favorite`, {
            method: 'POST',
        });
    }

    async deleteFavoriteVideo(video_id) {
        return await this._request(`/videos/${video_id}/favorite`, {
            method: 'DELETE',
        });
    }

    async getFavoriteVideosList() {
        const data = await this._request(`/users/me/video-favorites`);
        if (data && data.items && Array.isArray(data.items)) {
            return data.items.map(mapVideoDTO);
        }
        if (Array.isArray(data)) {
            return data.map(mapVideoDTO);
        }
        return [];
    }

    async getVideoReactions(video_id) {
        return await this._request(`/videos/${video_id}/reactions`);
    }

    async postVideoReaction(video_id, reaction_type) {
        const data = await this._request(`/videos/${video_id}/reactions`, {
            method: 'POST',
            body: JSON.stringify({ reaction_type }),
        });
        return data; // VideoReactionResponse
    }

    async deleteVideoReaction(video_id) {
        return await this._request(`/videos/${video_id}/reactions`, {
            method: 'DELETE',
        });
    }
}

export const api = new SpiderShareClient();