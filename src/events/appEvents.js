export const APP_EVENTS = {
  AUTH_EXPIRED: "auth-expired",
  CATEGORIES_UPDATED: "categories-updated",
  FAVORITES_CHANGED: "favorites-changed",
  TAGS_UPDATED: "tags-updated",
  VIDEOS_CHANGED: "videos-changed",
  VIDEO_DELETED: "video-deleted",
  VIDEO_UPDATED: "video-updated",
  TOKEN_REFRESHED: "token-refreshed",
};

export const emitAppEvent = (eventName, detail) => {
  window.dispatchEvent(
    detail === undefined ? new Event(eventName) : new CustomEvent(eventName, { detail }),
  );
};

export const onAppEvent = (eventName, handler) => {
  window.addEventListener(eventName, handler);
  return () => window.removeEventListener(eventName, handler);
};