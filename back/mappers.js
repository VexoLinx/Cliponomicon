// mappers.js

export const mapUserDTO = (data) => ({
    id: data.id,
    username: data.username,
    displayName: data.display_name || null,
    bio: data.bio || null,
    hasAvatar: data.has_avatar || false,
    ldap: data.ldap || false,
    role: data.role || 'user',
    isActive: data.is_active || false,
    lastSeenVersion: data.last_seen_version || null,
    lastLoginAt: data.last_login_at ? new Date(data.last_login_at) : null,
    createdAt: data.created_at ? new Date(data.created_at) : null,
    updatedAt: data.updated_at ? new Date(data.updated_at) : null
});

export const mapSteamGameDTO = (data) => ({
    appId: data.appid,
    name: data.name || 'Juego Desconocido',
    playtimeForever: data.playtime_forever || 0,
    playtime2Weeks: data.playtime_2weeks || 0,
    imgIconUrl: data.img_icon_url || null,
    iconUrl: data.icon_url || null,
    headerImageUrl: data.header_image_url || null,
    capsuleImageUrl: data.capsule_image_url || null
});

export const mapVideoDTO = (data) => ({
    id: data.id,
    title: data.title,
    description: data.description,
    ownerId: data.owner_id,
    isRegisteredOnly: data.is_registered_only,
    processingStatus: data.processing_status,
    favoriteCount: data.favorite_count || 0,
    popularityScore: data.popularity_score || 0,
    categories: data.categories || [],
    tags: data.tags || [],
    createdAt: data.created_at ? new Date(data.created_at) : null,
    updatedAt: data.updated_at ? new Date(data.updated_at) : null,
    playbackUrl: data.playback_url || null,
    downloadUrl: data.download_url || null,
    thumbnailUrl: data.thumbnail_url || null,
    isOwner: data.is_owner || false,
    canEdit: data.can_edit || false,
    canDelete: data.can_delete || false,
    isFavorite: data.is_favorite || false,
    reactions: data.reactions || []
});