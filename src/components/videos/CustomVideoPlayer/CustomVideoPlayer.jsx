import EditedBadge from "./EditedBadge";
import PlayerControls from "./PlayerControls";
import { useVideoPlayer } from "./useVideoPlayer";
import "./CustomVideoPlayer.css";

const CustomVideoPlayer = ({ video }) => {
  const { refs, states, actions } = useVideoPlayer(video);
  const { playerContainerRef, settingsRef, videoRef } = refs;

  return (
    <div
      className={`custom-player-wrapper ${states.activeMenu ? "menu-open" : ""}`}
      ref={playerContainerRef}
    >
      {video?.edited && <EditedBadge />}

      <video
        ref={videoRef}
        className="custom-video-element"
        src={states.currentStreamUrl}
        autoPlay
        playsInline
        onClick={actions.togglePlay}
        onTimeUpdate={actions.handleTimeUpdate}
        onLoadedMetadata={actions.handleLoadedMetadata}
        onEnded={actions.handleVideoEnd}
        onError={actions.handleVideoError}
      />

      <PlayerControls actions={actions} settingsRef={settingsRef} states={states} />
    </div>
  );
};

export default CustomVideoPlayer;
