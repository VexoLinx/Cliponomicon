import { useParams } from "react-router-dom";
import InfiniteVideoGrid from "../../components/videos/InfiniteVideoGrid/InfiniteVideoGrid";
import { useUserProfile } from "./useUserProfile";
import "./UserProfilePage.css";

const getDisplayName = (profile) => profile?.displayName || profile?.display_name || profile?.username;

const UserProfilePage = () => {
  const { userId } = useParams();
  const {
    avatarUrl,
    error,
    hasMore,
    isFetchingNextPage,
    loadMoreVideos,
    loading,
    profile,
    videos,
  } = useUserProfile(userId);

  if (loading) {
    return (
      <div className="page-container user-profile-page">
        <p className="grid-status-text">Cargando perfil...</p>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="page-container user-profile-page">
        <p className="grid-status-text">{error}</p>
      </div>
    );
  }

  const displayName = getDisplayName(profile);

  return (
    <div className="page-container user-profile-page">
      <header className="user-profile-header">
        <div className="user-profile-avatar">
          {avatarUrl ? (
            <img src={avatarUrl} alt={displayName} />
          ) : (
            <span>{displayName?.charAt(0)?.toUpperCase() || "U"}</span>
          )}
        </div>
        <div className="user-profile-copy">
          <h1>{displayName}</h1>
          <p>@{profile.username}</p>
          {profile.bio && <span>{profile.bio}</span>}
        </div>
      </header>

      {error && <p className="grid-status-text">{error}</p>}

      <InfiniteVideoGrid
        videos={videos}
        statusText={videos.length === 0 ? "Este usuario aun no tiene clips visibles." : ""}
        hasMore={hasMore}
        isFetchingNextPage={isFetchingNextPage}
        loadMoreVideos={loadMoreVideos}
      />
    </div>
  );
};

export default UserProfilePage;
