const EditVideoPane = ({ onVideoLoad, video }) => (
  <div className="modal-video-container">
    <video
      controls
      className="main-video"
      src={video.videoUrl}
      onLoadedMetadata={onVideoLoad}
    />
  </div>
);

export default EditVideoPane;
