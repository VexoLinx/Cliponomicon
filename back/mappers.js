// mappers.js

export const mapUserDTO = (data) => ({
    id: data.id,
    username: data.username,
    role: data.role || 'user',
    createdAt: data.created_at ? new Date(data.created_at) : null
});

export const mapSteamGameDTO = (data) => ({
    steam_id_or_vanity: data.id,
});

export const mapVideoDTO = (data) => ({
    video_id: data.id,
    title: data.title,
    tags: data.tags,
    owner_id: data.ownerId

})