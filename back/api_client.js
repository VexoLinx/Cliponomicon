// api_client.js
import { mapUserDTO, mapSteamGameDTO,mapVideoDTO } from './mappers.js';

class SpiderShareClient {

    constructor(baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000') {
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
    suscribe(callback){
        this.listeners.push(callback);
        return () => this.listeners = this.listeners.filter(cb => cb !== callback);
    }

    notify(){
        this.listeners.forEach(callback => callback(!!this.token));
    }

    /**
     * @param {string|null} token 
     */
    setToken(token){
        this.token = token;
        if(token){
            localStorage.setItem('token',token);
        } else {
            localStorage.removeItem('token');
        }
        this.notify();
    }

    async _request(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try{
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                ...options,
                headers,
            });

            if (response.status === 401){
                this.logout();
                window.dispatchEvent(new CustomEvent('onUnauthorized'));
                throw new Error('No autorizado - Inicia sesión nuevamente');
            }
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Error en la petición');
            }
            return response.status === 204 ? null : await response.json();
        }catch(error){
            console.error('API Error:', error);
            throw error;
        }
    }


    // AUTH
    async register(username, password){
        return await this._request(`/auth/register`,{
            method: 'POST',
            body: JSON.stringify({username,password}),
        });
    }

    async login(username, password) {
        const data = await this._request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
        if (data.access_token) this.setToken(data.access_token);
        return data;
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
        return data.map(mapUserDTO);
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
        return await this._request(`/users/${userId}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    async deleteUser(userId) {
        return await this._request(`/users/${userId}`, {
            method: 'DELETE',
        });
    }

    // USERS-->AVATAR
    async putAvatar(userId) {
        return await this._request(`/users/${userId}/avatar`, {
            method: 'PUT',
        });
    }

    async deleteAvatar(userId) {
        return await this._request(`/users/${userId}/avatar`, {
            method: 'DELETE',
        });
    }

    async getAvatar(userId) {
        return await this._request(`/users/${userId}/avatar`, {
            method: 'GET',
        });
    }

    // USERS-->PASSWORD
    async changePassword(userId, password) {
        return await this._request(`/users/${userId}/password`, {
            method: 'PUT',
            body: JSON.stringify({ password }),
        });
    }

    // STEAM
    /**
     * @param {string} steamIdOrVanity 
     * @returns {Promise<Array>}
     */
    async getSteamGames(steamIdOrVanity) {
        const data = await this._request(`/steam/users/${steamIdOrVanity}/games`);
        return data.map(mapSteamGameDTO);
    }

    //VIDEO
    /**
     * @param {string} file
     * @param {string} title 
     * @param {string} description
     * @param {boolean} is_registered_only
     * @param {Array} category_ids
     * @param {Array} tags
     * @returns {Promise<Array>}
     */
    async postVideo(file, title, description, is_registered_only, category_ids, tags) {
        is_registered_only = (typeof is_registered_only === 'undefined') ? false : is_registered_only;
        category_ids = (typeof category_ids === 'undefined') ? [] : category_ids;
        tags = (typeof tags === 'undefined') ? [] : tags;
        
        return await this._request('/videos', {
            method: 'POST',
            body: JSON.stringify(file, title, description, is_registered_only, category_ids, tags),
        });
    }
    /** 
     * @returns {Promise<Object>}
     */

    async getVideos() {
        const data = await this._request(`/videos`);
        return data.map(mapVideoDTO);
    }
    /**
     * @param {string} video_id 
     * @returns {Promise<Object>}
     */
    async getVideo(video_id) {
        const data = await this._request(`/videos/${video_id}`);
        return data.map(mapVideoDTO);
    }
    async patchVideo(video_id, data) {
        data = (typeof data === 'undefined') ? {} : data;
        return await this._request(`/videos/${video_id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }).mapVideoDTO;
    }   
    

    async deleteVideo(video_id) {
        return await this._request(`/videos/${video_id}`, {
            method: 'DELETE',
        }).mapVideoDTO;
    }

    async downloadVideo(video_id) {
        return await this._request(`/videos/${video_id}/download`, {
            method: 'GET',
        }).mapVideoDTO;
    }

    async streamVideo(video_id) {
        return await this._request(`/videos/${video_id}/stream`, {
            method: 'GET',
        }).mapVideoDTO;
    }

    async getVideoThumbnail(video_id) {
        return await this._request.data(`/videos/${video_id}/thumbnail`, {
            method: 'GET',
        }).mapVideoDTO;
    }

    async postFavoriteVideo(video_id) {
        return await this._request(`/videos/${video_id}/favorite`, {
            method: 'POST',
        }).mapVideoDTO;
    }
    async deleteFavoriteVideo(video_id) {
        return await this._request(`/videos/${video_id}/favorite`, {
            method: 'DELETE',
        }).mapVideoDTO;
    }
    async getFavoriteVideosList() {
        return await this._request(`/users/me/video-favorites`, {
        }).mapVideoDTO;
    }
    async getVideoReactions(video_id) {
        return await this._request(`/videos/${video_id}/reactions`, {
        }).mapVideoDTO;
    }
    async postVideoReaction(video_id, reaction) {
        return await this._request(`/videos/${video_id}/reactions`, {
            method: 'POST',
            body: JSON.stringify({ reaction }),
        }).mapVideoDTO;
    }
    async deleteVideoReaction(video_id) {
        return await this._request(`/videos/${video_id}/reactions`, {
            method: 'DELETE',
        }).mapVideoDTO;
    }
}

export const api = new SpiderShareClient();