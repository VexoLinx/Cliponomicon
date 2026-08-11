import { CiLink } from "react-icons/ci";
import { IoClose, IoStar, IoStarOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const VideoModalSidebar = ({
  activeVideo,
  canEdit,
  closeVideo,
  currentReaction,
  handleCopyLink,
  handleOpenEdit,
  isFavorite,
  isUpdatingReaction,
  reactionCounts = {},
  reactionTypes = [],
  token,
  toggleFavorite,
  toggleReaction,
}) => {
  const ownerId = activeVideo?.owner?.id || activeVideo?.userId || activeVideo?.user_id;

  return (
    <div className="modal-sidebar">
      <div className="sidebar-header-video">
        <span className="now-playing">NOW PLAYING</span>
        <button className="close-btn" type="button" onClick={closeVideo}>
          <IoClose />
        </button>
      </div>

      <div className="sidebar-info">
        <h2 className="video-title-modal">{activeVideo.title}</h2>

        <div className="meta-group-container">
          <div className="video-meta-row">
            {ownerId ? (
              <Link className="user-handle-modal" to={`/users/${ownerId}`} onClick={closeVideo}>
                {activeVideo.userHandle || "@usuario"}
              </Link>
            ) : (
              <span className="user-handle-modal">{activeVideo.userHandle || "@usuario"}</span>
            )}

            {activeVideo.date && (
              <>
                <span className="meta-separator">|</span>
                <span className="video-technical-dates">{activeVideo.date}</span>
              </>
            )}
          </div>
          <p className="game-name-modal">{activeVideo.gameName || "General"}</p>
        </div>

        <div className="video-context-box">
          <p>{activeVideo.context || "Aqui ira la descripcion o contexto del video..."}</p>
        </div>

        {activeVideo.tags?.length > 0 && (
          <div className="modal-tags">
            {activeVideo.tags.map((tag) => (
              <Link
                key={tag.id}
                className="modal-tag"
                to={`/tags/${tag.id}`}
                onClick={closeVideo}
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}

        <div className="reaction-row">
          {reactionTypes.map((reaction) => (
            <button
              key={reaction.type}
              className={`reaction-btn ${currentReaction === reaction.type ? "is-active" : ""}`}
              type="button"
              disabled={!token || isUpdatingReaction}
              onClick={() => toggleReaction(reaction.type)}
              title={token ? reaction.label : "Inicia sesion para reaccionar"}
            >
              <span>{reaction.label}</span>
              <strong>{reactionCounts[reaction.type] || 0}</strong>
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-footer-video">
        <button className="footer-btn copy-btn" type="button" onClick={handleCopyLink} title="Copiar enlace">
          <CiLink />
        </button>

        {token && (
          <button
            className={`footer-btn favorite-btn ${isFavorite ? "is-favorite" : ""}`}
            type="button"
            onClick={toggleFavorite}
          >
            {isFavorite ? <IoStar className="star-icon" /> : <IoStarOutline className="star-icon" />}
            <span>{isFavorite ? "Favorito" : "Anadir a favoritos"}</span>
          </button>
        )}

        {canEdit && (
          <button className="footer-btn edit-btn" type="button" onClick={handleOpenEdit}>
            Editar
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoModalSidebar;
