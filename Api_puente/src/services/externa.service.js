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

// ADMIN
async function getAdminDashboard() {
    const response = await apiExterna.get('/admin/dashboard');
    return response.data;
}

// ADMIN-->VIDEOS
async function getAdminVideos(params = {}) {
    const response = await apiExterna.get('/admin/videos', { params });
    const data = response.data;
    return {
        id: data && data.id ? data.id.map(mapVideoDTO) : null,
        tittle: data && data.title ? data.title.map(mapVideoDTO) : null,
        ownerId: data && data.ownerId ? data.ownerId.map(mapVideoDTO) : null,
        ownerUsername: data && data.ownerUsername ? data.ownerUsername.map(mapVideoDTO) : null,
        visibility: data && data.visibility ? data.visibility : null,
        duration: data && data.duration ? data.duration : null,
        creartedAt: data && data.createdAt ? new Date(data.createdAt) : null,
    };
}

async function getAdminVideo(videoId) {
    const response = await apiExterna.get(`/admin/videos/${videoId}`);
    return mapVideoDTO(response.data);
};

async function deleteAdminVideo(videoId) {
    const response = await apiExterna.delete(`/admin/videos/${videoId}`);
    return response.data;
}

async function AdminRetryVideoProcessing(videoId) {
    const response = await apiExterna.post(`/admin/videos/${videoId}/processing/retry`);
    return response.data;
}

//ADMIN-->WORKER

async function getAdminWorkerEvents(params = {}) {
    const response = await apiExterna.get('/admin/worker/events', { params });
    return response.data;
}

async function getAdminWorkerLogs() {
    const response = await apiExterna.get('/admin/worker/logs');
    return response.data;
}

// ADMIN-->JOBS
async function getAdminJobs() {
    const response = await apiExterna.get('/admin/queue/jobs');
    return response.data;
}

async function getAdminJob(jobId) {
    const response = await apiExterna.get(`/admin/queue/jobs/${jobId}/requeue`);
    return response.data;
}

async function deleteAdminJob(jobId) {
    const response = await apiExterna.delete(`/admin/queue/jobs/${jobId}`);
    return response.data;
}

async function clearAdminFailedJobs() {
    const response = await apiExterna.delete(`/admin/queue/failed-jobs`);
    return response.data;
}

// ADMIN-->USERS

async function getUsersAdmin(params = {}) {
    const response = await apiExterna.get('/admin/users', { params });
    return Array.isArray(response.data) ? response.data.map(mapUserDTO) : [];
}
async function getUserAdmin(userId) {
    const response = await apiExterna.get(`/admin/users/${userId}`, userId);
    return mapUserDTO(response.data);
}

async function patchUserAdmin(userId, data = {}) {
    const response = await apiExterna.patch(`/admin/users/${userId}`, data);
    return mapUserDTO(response.data);
}

async function AdminAudit() {
    const response = await apiExterna.get(`/admin/audit`);
    return response.data;
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


// CATEGORY
async function getCategories() {
    const response = await apiExterna.get('/category');
    return response.data;
}

async function CreateCategory(categoryData={}) {
    const response = await apiExterna.post('/category', categoryData);
    return response.data;
}

async function getSteamCategories(term) {
    const response = await apiExterna.get(`/category/steam/search?term=${term}`);
    return response.data;
}

async function importSteamCategory() {
    const response = await apiExterna.post('/steam/category/steam/import');
    return response.data;
}



//INTERACTIONS
async function postFavoriteVideo(videoId) {
    const response = await apiExterna.post(`/interactions/videos/${videoId}/favorite`);
    return response.data;
}

async function deleteFavoriteVideo(videoId) {
    const response = await apiExterna.delete(`/interactions/videos/${videoId}/favorite`);
    return response.data;
}

async function getFavoriteVideosList() {
    const response = await apiExterna.get(`/interactions/me/video-favorites`);
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
    const response = await apiExterna.get(`/interactions/videos/${videoId}/reactions`);
    return response.data;
}

async function postVideoReaction(videoId) {
    const response = await apiExterna.post(`/interactions/videos/${videoId}/reactions`, { 
        reaction_type: "string"
    });
    return response.data;
}

async function deleteVideoReaction(videoId) {
    const response = await apiExterna.delete(`/interactions/videos/${videoId}/reactions`);
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
    deleteVideoReaction,
    getCategories,
    CreateCategory,
    getSteamCategories,
    importSteamCategory,
    getAdminDashboard,
    getAdminVideos,
    getAdminVideo,
    deleteAdminVideo,
    AdminRetryVideoProcessing,
    getAdminWorkerEvents,
    getAdminWorkerLogs,
    getAdminJobs,
    getAdminJob,
    deleteAdminJob,
    clearAdminFailedJobs,
    getUsersAdmin,
    getUserAdmin,
    patchUserAdmin,
    AdminAudit,
};
