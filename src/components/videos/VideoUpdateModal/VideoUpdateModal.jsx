import ReactDOM from "react-dom";
import EditSidebar from "./EditSidebar";
import EditVideoPane from "./EditVideoPane";
import UpdateStatusPanel from "./UpdateStatusPanel";
import { useVideoUpdateCategories } from "./useVideoUpdateCategories";
import "./VideoUpdateModal.css";
import "../videos.css";

const VideoUpdateModal = ({
  status,
  video,
  title,
  setTitle,
  description,
  setDescription,
  isEdited,
  setIsEdited,
  categoryId,
  setCategoryId,
  categoriesList = [],
  errorMessage,
  onClose,
  onSave,
  onDelete,
  onRetry,
}) => {
  const localCategories = useVideoUpdateCategories({
    categoryId,
    categoriesList,
    setCategoryId,
    video,
  });

  const handleVideoLoad = (event) => {
    const { videoWidth, videoHeight } = event.currentTarget;
    event.currentTarget.style.aspectRatio = `${videoWidth} / ${videoHeight}`;
  };

  if (!video) return null;

  return ReactDOM.createPortal(
    <div
      className="modal-overlay"
      onClick={status === "editing" || status === "error" ? onClose : undefined}
    >
      <div className="modal-content" onClick={(event) => event.stopPropagation()}>
        {status === "editing" ? (
          <>
            <EditVideoPane onVideoLoad={handleVideoLoad} video={video} />
            <EditSidebar
              categoryId={categoryId}
              description={description}
              errorMessage={errorMessage}
              isEdited={isEdited}
              localCategories={localCategories}
              onClose={onClose}
              onDelete={onDelete}
              onSave={onSave}
              setCategoryId={setCategoryId}
              setDescription={setDescription}
              setIsEdited={setIsEdited}
              setTitle={setTitle}
              title={title}
              video={video}
            />
          </>
        ) : (
          <UpdateStatusPanel errorMessage={errorMessage} onRetry={onRetry} status={status} />
        )}
      </div>
    </div>,
    document.body,
  );
};

export default VideoUpdateModal;
