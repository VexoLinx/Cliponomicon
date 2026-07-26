import { useMemo } from "react";
import { useLocation } from "react-router-dom";

const SEARCH_MODES = {
  FAVORITES: {
    key: "favorites",
    placeholder: "Buscar en favoritos...",
    showSort: false,
    type: "plain",
  },
  GAMES: {
    key: "games",
    placeholder: "Buscar juegos...",
    showSort: false,
    type: "plain",
  },
  GAME_DETAIL: {
    key: "game-detail",
    placeholder: "Buscar clips de este juego...",
    showSort: true,
    type: "plain",
  },
  HIDDEN: {
    key: "hidden",
    placeholder: "",
    showSort: false,
    type: "hidden",
  },
  TAG_DETAIL: {
    key: "tag-detail",
    placeholder: "Buscar clips de este tag...",
    showSort: true,
    type: "plain",
  },
  TAGS: {
    key: "tags",
    placeholder: "Buscar tags...",
    showSort: false,
    type: "plain",
  },
  VIDEOS: {
    key: "videos",
    placeholder: "@usuario, #tag, titulo...",
    showSort: true,
    type: "video",
  },
};

const getSearchMode = (pathname) => {
  if (pathname === "/") return SEARCH_MODES.VIDEOS;
  if (pathname === "/games") return SEARCH_MODES.GAMES;
  if (pathname.startsWith("/games/")) return SEARCH_MODES.GAME_DETAIL;
  if (pathname === "/tags") return SEARCH_MODES.TAGS;
  if (pathname.startsWith("/tags/")) return SEARCH_MODES.TAG_DETAIL;
  if (pathname === "/favorites") return SEARCH_MODES.FAVORITES;
  return SEARCH_MODES.HIDDEN;
};

export const useTopBarSearchMode = () => {
  const { pathname } = useLocation();
  return useMemo(() => getSearchMode(pathname), [pathname]);
};
