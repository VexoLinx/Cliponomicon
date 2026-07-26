import ReactDOM from "react-dom";
import { useAuth } from "../../../context/AuthContext";
import CustomVideoPlayer from "../CustomVideoPlayer/CustomVideoPlayer";
import VideoUpdateModal from "../VideoUpdateModal/VideoUpdateModal";
import VideoModalSidebar from "./VideoModalSidebar";
import { useCopyClipLink } from "./useCopyClipLink";
import { useGlobalVideoModal } from "./useGlobalVideoModal";
import "./GlobalVideoModal.css";

const GlobalVideoModal = () => {
  const { token } = useAuth();
  const modal = useGlobalVideoModal();
  const { copyLink, showToast } = useCopyClipLink(modal.activeVideo?.id);

  if (!modal.activeVideo) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={modal.closeVideo}>
      <div className="modal-content" onClick={(event) => event.stopPropagation()}>
        <div className="modal-video-container">
          <CustomVideoPlayer video={modal.activeVideo} />
        </div>

        <VideoModalSidebar
          activeVideo={modal.activeVideo}
          canEdit={modal.canEdit}
          closeVideo={modal.closeVideo}
          handleCopyLink={copyLink}
          handleOpenEdit={modal.handleOpenEdit}
          isFavorite={modal.isFavorite}
          token={token}
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
