import { CiLink } from "react-icons/ci";
import { IoClose, IoStar, IoStarOutline } from "react-icons/io5";

const VideoModalSidebar = ({
  activeVideo,
  canEdit,
  closeVideo,
  handleCopyLink,
  handleOpenEdit,
  isFavorite,
  token,
  toggleFavorite,
}) => (
  <div className="modal-sidebar">
    <div className="sidebar-header-video">
      <span className="now-playing">NOW PLAYING</span>
      <button className="close-btn" onClick={closeVideo}>
        <IoClose />
      </button>
    </div>

    <div className="sidebar-info">
      <h2 className="video-title-modal">{activeVideo.title}</h2>
      <div className="video-meta-row">
        <span className="user-handle-modal">{activeVideo.userHandle || "@usuario"}</span>
        <span className="meta-separator">|</span>
        <span className="video-date-modal">{activeVideo.date}</span>
      </div>

      <p className="game-name-modal">{activeVideo.gameName || "General"}</p>

      <div className="video-context-box">
        <p>{activeVideo.context || "Aqui ira la descripcion o contexto del video..."}</p>
      </div>
    </div>

    <div className="sidebar-footer-video">
      <button className="footer-btn copy-btn" onClick={handleCopyLink} title="Copiar enlace">
        <CiLink />
      </button>

      {token && (
        <button
          className={`footer-btn favorite-btn ${isFavorite ? "is-favorite" : ""}`}
          onClick={toggleFavorite}
        >
          {isFavorite ? <IoStar className="star-icon" /> : <IoStarOutline className="star-icon" />}
          <span>{isFavorite ? "Favorito" : "Anadir a favoritos"}</span>
        </button>
      )}

      {canEdit && (
        <button className="footer-btn edit-btn" onClick={handleOpenEdit}>
          Editar
        </button>
      )}
    </div>
  </div>
);

export default VideoModalSidebar;
