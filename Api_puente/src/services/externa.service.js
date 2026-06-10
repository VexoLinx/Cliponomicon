const axios = require('axios');
const { mapUserDTO, mapSteamGameDTO, mapVideoDTO } = require('./mappers.service');
const { PROXY_CONFIG } = require('./proxy_config.service');

const apiExterna = axios.create({
    baseURL: PROXY_CONFIG.BASE_URL,
    headers: {
        ...PROXY_CONFIG.FETCH_OPTIONS.headers
    },
});

// AUTH
async function register(username, password, role = 'user') {
    const response = await apiExterna.post('/auth/register', { username, password, role });
    return mapUserDTO(response.data);
}

async function login(username, password) {
    const response = await apiExterna.post('/auth/login', { username, password });
    return response.data; // Return raw data to get the token, caller can map if needed
}

async function getMe() {
    const response = await apiExterna.get('/auth/me');
    return mapUserDTO(response.data);
}

// USERS
async function listUsers() {
    const response = await apiExterna.get('/users');
    return Array.isArray(response.data) ? response.data.map(mapUserDTO) : [];
}

async function getUser(userId) {
    const response = await apiExterna.get(`/users/${userId}`);
    return mapUserDTO(response.data);
}

async function patchUser(userId, data = {}) {
    const response = await apiExterna.patch(`/users/${userId}`, data);
    return mapUserDTO(response.data);
}

async function deleteUser(userId) {
    const response = await apiExterna.delete(`/users/${userId}`);
    return response.data;
}

// USERS-->AVATAR
async function putAvatar(userId, formData) {
    const response = await apiExterna.put(`/users/${userId}/avatar`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return mapUserDTO(response.data);
}

async function deleteAvatar(userId) {
    const response = await apiExterna.delete(`/users/${userId}/avatar`);
    return mapUserDTO(response.data);
}

async function getAvatar(userId) {
    const response = await apiExterna.get(`/users/${userId}/avatar`, {
        responseType: 'application/json'
    });
    return response.data;
}

// USERS-->PASSWORD
async function changePassword(userId, newPassword, currentPassword = null) {
    const payload = { new_password: newPassword };
    if (currentPassword) payload.current_password = currentPassword;
    const response = await apiExterna.patch(`/users/${userId}/password`, payload);
    return response.data;
}

// STEAM
async function getSteamGames(steamIdOrVanity) {
    const response = await apiExterna.get(`/steam/users/${steamIdOrVanity}/games`);
    if (response.data && response.data.games && Array.isArray(response.data.games)) {
        return response.data.games.map(mapSteamGameDTO);
    }
    return [];
}

// VIDEO
async function postVideo(formData) {
    const response = await apiExterna.post('/videos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return mapVideoDTO(response.data);
}

async function getVideos(params = {}) {
    const response = await apiExterna.get('/videos', { params });
    const data = response.data;
    return {
        items: data && data.items ? data.items.map(mapVideoDTO) : [],
        total: (data && data.total) || 0,
        limit: (data && data.limit) || params.limit || 20,
        offset: (data && data.offset) || params.offset || 0
    };
}

async function getVideo(videoId) {
    const response = await apiExterna.get(`/videos/${videoId}`);
    return mapVideoDTO(response.data);
}

async function patchVideo(videoId, data = {}) {
    const response = await apiExterna.patch(`/videos/${videoId}`, data);
    return mapVideoDTO(response.data);
}

async function deleteVideo(videoId) {
    const response = await apiExterna.delete(`/videos/${videoId}`);
    return response.data;
}

async function downloadVideo(videoId) {
    const response = await apiExterna.get(`/videos/${videoId}/download`, {
        responseType: 'application/json'
    });
    return response.data;
}

async function streamVideo(videoId, variantType = 'low_h264') {
    const response = await apiExterna.get(`/videos/${videoId}/stream`, {
        params: { variant_type: variantType },
        responseType: 'application/json'
    });
    return response.data;
}

async function getVideoThumbnail(videoId) {
    const response = await apiExterna.get(`/videos/${videoId}/thumbnail`, {
        responseType: 'application/json'
    });
    return response.data;
}

async function postFavoriteVideo(videoId) {
    const response = await apiExterna.post(`/videos/${videoId}/favorite`);
    return response.data;
}

async function deleteFavoriteVideo(videoId) {
    const response = await apiExterna.delete(`/videos/${videoId}/favorite`);
    return response.data;
}

async function getFavoriteVideosList() {
    const response = await apiExterna.get(`/users/me/video-favorites`);
    const data = response.data;
    if (data && data.items && Array.isArray(data.items)) {
        return data.items.map(mapVideoDTO);
    }
    if (Array.isArray(data)) {
        return data.map(mapVideoDTO);
    }
    return [];
}

async function getVideoReactions(videoId) {
    const response = await apiExterna.get(`/videos/${videoId}/reactions`);
    return response.data;
}

async function postVideoReaction(videoId, reactionType) {
    const response = await apiExterna.post(`/videos/${videoId}/reactions`, { 
        reaction_type: reactionType 
    });
    return response.data;
}

async function deleteVideoReaction(videoId) {
    const response = await apiExterna.delete(`/videos/${videoId}/reactions`);
    return response.data;
}

module.exports = {
    register,
    login,
    getMe,
    listUsers,
    getUser,
    patchUser,
    deleteUser,
    putAvatar,
    deleteAvatar,
    getAvatar,
    changePassword,
    getSteamGames,
    postVideo,
    getVideos,
    getVideo,
    patchVideo,
    deleteVideo,
    downloadVideo,
    streamVideo,
    getVideoThumbnail,
    postFavoriteVideo,
    deleteFavoriteVideo,
    getFavoriteVideosList,
    getVideoReactions,
    postVideoReaction,
    deleteVideoReaction
};
