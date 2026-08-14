import ReactDOM from "react-dom";
import { useAuth } from "../../../context/AuthContext";
import CustomVideoPlayer from "../CustomVideoPlayer/CustomVideoPlayer";
import VideoUpdateModal from "../VideoUpdateModal/VideoUpdateModal";
import VideoModalSidebar from "./VideoModalSidebar";
import { useCopyClipLink } from "./useCopyClipLink";
import { useGlobalVideoModal } from "./useGlobalVideoModal";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import "./GlobalVideoModal.css";

const GlobalVideoModal = () => {
  const { token } = useAuth();
  const modal = useGlobalVideoModal();
  const { copyLink, showToast } = useCopyClipLink(modal.activeVideo?.id);

  if (!modal.activeVideo) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={modal.closeVideo}>
      <div className="modal-content" onClick={(event) => event.stopPropagation()}>
        
        <div className="modal-video-container" style={{ position: 'relative' }}>
          {modal.hasPrev && (
            <button className="carousel-nav-btn prev" onClick={modal.playPrev}>
              <IoChevronBack />
            </button>
          )}

          <CustomVideoPlayer video={modal.activeVideo} />

          {modal.hasNext && (
            <button className="carousel-nav-btn next" onClick={modal.playNext}>
              <IoChevronForward />
            </button>
          )}
        </div>

        <VideoModalSidebar
          activeVideo={modal.activeVideo}
          canEdit={modal.canEdit}
          closeVideo={modal.closeVideo}
          currentReaction={modal.currentReaction}
          handleCopyLink={copyLink}
          handleOpenEdit={modal.handleOpenEdit}
          isFavorite={modal.isFavorite}
          isUpdatingReaction={modal.isUpdatingReaction}
          reactionCounts={modal.reactionCounts}
          reactionTypes={modal.reactionTypes}
          token={token}
          toggleReaction={modal.toggleReaction}
          toggleFavorite={modal.toggleFavorite}
        />
      </div>

      {modal.isEditing && (
        <VideoUpdateModal
          status={modal.editStatus}
          video={modal.activeVideo}
          title={modal.editTitle}
          setTitle={modal.setEditTitle}
          description={modal.editDescription}
          setDescription={modal.setEditDescription}
          isEdited={modal.editIsEdited}
          setIsEdited={modal.setEditIsEdited}
          categoryId={modal.editCategoryId}
          setCategoryId={modal.setEditCategoryId}
          tagIds={modal.editTagIds}
          setTagIds={modal.setEditTagIds}
          errorMessage={modal.updateError}
          onClose={() => modal.setIsEditing(false)}
          onSave={modal.handleSaveChanges}
          onDelete={modal.canDelete ? modal.handleDeleteVideo : undefined}
          onRetry={() => modal.setEditStatus("editing")}
        />
      )}

      {showToast && <div className="copy-toast">Enlace copiado</div>}
    </div>,
    document.body,
  );
};

export default GlobalVideoModal;
