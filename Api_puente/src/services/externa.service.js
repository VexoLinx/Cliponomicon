const axios = require('axios');
const { mapUserDTO, mapSteamGameDTO, mapVideoDTO } = require('./mappers.service');
const { PROXY_CONFIG, getAuthHeaders } = require('./proxy_config.service');

const apiExterna = axios.create({
    baseURL: PROXY_CONFIG.BASE_URL
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

async function getMe(token) {
    const response = await apiExterna.get('/auth/me', { headers: getAuthHeaders(token) });
    return mapUserDTO(response.data);
}

// ADMIN
async function getAdminDashboard(token) {
    const response = await apiExterna.get('/admin/dashboard', { headers: getAuthHeaders(token) });
    return response.data;
}

// ADMIN-->VIDEOS
async function getAdminVideos(params = {}, token) {
    const response = await apiExterna.get('/admin/videos', { params, headers: getAuthHeaders(token) });
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

async function getAdminVideo(videoId, token) {
    const response = await apiExterna.get(`/admin/videos/${videoId}`, { headers: getAuthHeaders(token) });
    return mapVideoDTO(response.data);
}

async function deleteAdminVideo(videoId, token) {
    const response = await apiExterna.delete(`/admin/videos/${videoId}`, { headers: getAuthHeaders(token) });
    return response.data;
}

async function AdminRetryVideoProcessing(videoId, token) {
    const response = await apiExterna.post(`/admin/videos/${videoId}/processing/retry`, { headers: getAuthHeaders(token) });
    return response.data;
}

//ADMIN-->WORKER

async function getAdminWorkerEvents(params = {}, token) {
    const response = await apiExterna.get('/admin/worker/events', params, {headers: getAuthHeaders(token) });
    return response.data;
}

async function getAdminWorkerLogs(token) {
    const response = await apiExterna.get('/admin/worker/logs', { headers: getAuthHeaders(token) });
    return response.data;
}

// ADMIN-->JOBS
async function getAdminJobs(token) {
    const response = await apiExterna.get('/admin/queue/jobs', { headers: getAuthHeaders(token) });
    return response.data;
}

async function getAdminJob(jobId, token) {
    const response = await apiExterna.get(`/admin/queue/jobs/${jobId}/requeue`, { headers: getAuthHeaders(token) });
    return response.data;
}

async function deleteAdminJob(jobId, token) {
    const response = await apiExterna.delete(`/admin/queue/jobs/${jobId}`, { headers: getAuthHeaders(token) });
    return response.data;
}

async function clearAdminFailedJobs(token) {
    const response = await apiExterna.delete(`/admin/queue/failed-jobs`, { headers: getAuthHeaders(token) });
    return response.data;
}

// ADMIN-->USERS

async function getUsersAdmin(params = {}, token) {
    const response = await apiExterna.get('/admin/users', params, {  headers: getAuthHeaders(token) });
    return Array.isArray(response.data) ? response.data.map(mapUserDTO) : [];
}
async function getUserAdmin(userId, token) {
    const response = await apiExterna.get(`/admin/users/${userId}`, { headers: getAuthHeaders(token) });
    return mapUserDTO(response.data);
}

async function patchUserAdmin(userId, data = {}, token) {
    const response = await apiExterna.patch(`/admin/users/${userId}`, data, { headers: getAuthHeaders(token) });
    return mapUserDTO(response.data);
}

async function AdminAudit(token) {
    const response = await apiExterna.get(`/admin/audit`, { headers: getAuthHeaders(token) });
    return response.data;
}
// USERS
async function listUsers(token) {
    const response = await apiExterna.get('/users', {
        headers: getAuthHeaders(token)
    });
    return Array.isArray(response.data) ? response.data.map(mapUserDTO) : [];
}

async function getUser(userId, token) {
    const response = await apiExterna.get(`/users/${userId}`, {
        headers: getAuthHeaders(token)
    });
    return mapUserDTO(response.data);
}

async function patchUser(userId, data = {}, token) {
    const response = await apiExterna.patch(`/users/${userId}`, data, {
        headers: getAuthHeaders(token)
    });
    return mapUserDTO(response.data);
}

async function deleteUser(userId, token) {
    const response = await apiExterna.delete(`/users/${userId}`, {
        headers: getAuthHeaders(token)
    });
    return response.data;
}

// USERS-->AVATAR
async function putAvatar(userId, formData, token) {
    const response = await apiExterna.put(`/users/${userId}/avatar`, formData, {
        headers: { 
            ...getAuthHeaders(token),
            'Content-Type': 'multipart/form-data' 
        }
    });
    return mapUserDTO(response.data);
}

async function deleteAvatar(userId, token) {
    const response = await apiExterna.delete(`/users/${userId}/avatar`, {
        headers: getAuthHeaders(token)
    });
    return mapUserDTO(response.data);
}

async function getAvatar(userId, token) {
    const response = await apiExterna.get(`/users/${userId}/avatar`, {
        headers: getAuthHeaders(token),
        responseType: 'application/json'
    });
    return response.data;
}

// USERS-->PASSWORD
async function changePassword(userId, newPassword, currentPassword = null, token) {
    const payload = { new_password: newPassword };
    if (currentPassword) payload.current_password = currentPassword;
    const response = await apiExterna.patch(`/users/${userId}/password`, payload, {
        headers: getAuthHeaders(token)
    });
    return response.data;
}

// STEAM
async function getSteamGames(steamIdOrVanity, token) {
    const response = await apiExterna.get(`/steam/users/${steamIdOrVanity}/games`, {
        headers: getAuthHeaders(token)
    });
    if (response.data && response.data.games && Array.isArray(response.data.games)) {
        return response.data.games.map(mapSteamGameDTO);
    }
    return [];
}

// VIDEO
async function postVideo(formData, token) {
    const response = await apiExterna.post('/videos', formData, {
        headers: { 
            ...getAuthHeaders(token),
            'Content-Type': 'multipart/form-data' 
        }
    });
    return mapVideoDTO(response.data);
}

async function getVideos(params = {}, token) {
    const response = await apiExterna.get('/videos', { 
        params,
        headers: getAuthHeaders(token)
    });
    const data = response.data;
    return {
        items: data && data.items ? data.items.map(mapVideoDTO) : [],
        total: (data && data.total) || 0,
        limit: (data && data.limit) || params.limit || 20,
        offset: (data && data.offset) || params.offset || 0
    };
}

async function getVideo(videoId, token) {
    const response = await apiExterna.get(`/videos/${videoId}`, {
        headers: getAuthHeaders(token)
    });
    return mapVideoDTO(response.data);
}

async function patchVideo(videoId, data = {}, token) {
    const response = await apiExterna.patch(`/videos/${videoId}`, data, {
        headers: getAuthHeaders(token)
    });
    return mapVideoDTO(response.data);
}

async function deleteVideo(videoId, token) {
    const response = await apiExterna.delete(`/videos/${videoId}`, {
        headers: getAuthHeaders(token)
    });
    return response.data;
}

async function downloadVideo(videoId, token) {
    const response = await apiExterna.get(`/videos/${videoId}/download`, {
        headers: getAuthHeaders(token),
        responseType: 'application/json'
    });
    return response.data;
}

async function streamVideo(videoId, variantType = 'low_h264', token) {
    const response = await apiExterna.get(`/videos/${videoId}/stream`, {
        params: { variant_type: variantType },
        headers: getAuthHeaders(token),
        responseType: 'application/json'
    });
    return response.data;
}

async function getVideoThumbnail(videoId, token) {
    const response = await apiExterna.get(`/videos/${videoId}/thumbnail`, {
        headers: getAuthHeaders(token),
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
async function postFavoriteVideo(videoId, token) {
    const response = await apiExterna.post(`/interactions/videos/${videoId}/favorite`, { headers: getAuthHeaders(token) });
    return response.data;
}

async function deleteFavoriteVideo(videoId, token) {
    const response = await apiExterna.delete(`/interactions/videos/${videoId}/favorite`, { headers: getAuthHeaders(token) });
    return response.data;
}

async function getFavoriteVideosList(token) {
    const response = await apiExterna.get(`/interactions/me/video-favorites`, { headers: getAuthHeaders(token) });
    const data = response.data;
    if (data && data.items && Array.isArray(data.items)) {
        return data.items.map(mapVideoDTO);
    }
    if (Array.isArray(data)) {
        return data.map(mapVideoDTO);
    }
    return [];
}

async function getVideoReactions(videoId, token) {
    const response = await apiExterna.get(`/interactions/videos/${videoId}/reactions`, { headers: getAuthHeaders(token) });
    return response.data;
}

async function postVideoReaction(videoId, token) {
    const response = await apiExterna.post(`/interactions/videos/${videoId}/reactions`, { 
        reaction_type: "string"
    }, { headers: getAuthHeaders(token) });
    return response.data;
}

async function deleteVideoReaction(videoId, token) {
    const response = await apiExterna.delete(`/interactions/videos/${videoId}/reactions`, { headers: getAuthHeaders(token) });
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
