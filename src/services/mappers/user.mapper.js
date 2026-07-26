export const mapUser = (user) => {
  if (!user) return null;

  return {
    ...user,
    displayName: user.display_name ?? null,
    hasAvatar: Boolean(user.has_avatar),
    authProvider: user.auth_provider,
    oidcSubject: user.oidc_subject ?? null,
    oidcEmail: user.oidc_email ?? null,
    oidcName: user.oidc_name ?? null,
    oidcGroups: user.oidc_groups || [],
    isActive: Boolean(user.is_active),
    lastSeenVersion: user.last_seen_version ?? null,
    lastLoginAt: user.last_login_at ?? null,
    createdAt: user.created_at ?? null,
    updatedAt: user.updated_at ?? null,
  };
};

export const mapUsers = (users) => (Array.isArray(users) ? users.map(mapUser) : []);

export const mapLoginResponse = (data) => ({
  ...data,
  user: mapUser(data?.user),
});
