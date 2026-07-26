import {
  IoContract,
  IoExpand,
  IoPause,
  IoPlay,
  IoVolumeHigh,
  IoVolumeMute,
} from "react-icons/io5";
import SettingsMenu from "./SettingsMenu";

const PlayerControls = ({ actions, settingsRef, states }) => {
  const currentVolume = states.isMuted ? 0 : states.volume;

  return (
    <div className="custom-controls-bar">
      <input
        type="range"
        className="progress-slider"
        min="0"
        max="100"
        value={states.progress}
        onChange={actions.handleSeek}
        style={{ "--progress": `${states.progress}%` }}
      />

      <div className="controls-row">
        <div className="controls-left">
          <button className="control-btn play-btn" onClick={actions.togglePlay}>
            {states.isPlaying ? <IoPause /> : <IoPlay />}
          </button>

          <div className="volume-container">
            <button className="control-btn" onClick={actions.toggleMute}>
              {states.isMuted || states.volume === 0 ? <IoVolumeMute /> : <IoVolumeHigh />}
            </button>
            <input
              type="range"
              className="volume-slider"
              min="0"
              max="1"
              step="0.05"
              value={currentVolume}
              onChange={actions.handleVolumeChange}
              style={{ "--volume": `${currentVolume * 100}%` }}
            />
          </div>

          <span className="time-display">
            {states.currentTime} / {states.duration}
          </span>
        </div>

        <div className="controls-right">
          <SettingsMenu
            activeMenu={states.activeMenu}
            availableVariants={states.availableVariants}
            changeQuality={actions.changeQuality}
            changeSpeed={actions.changeSpeed}
            handleDownload={actions.handleDownload}
            isDownloading={states.isDownloading}
            playbackRate={states.playbackRate}
            setActiveMenu={actions.setActiveMenu}
            settingsRef={settingsRef}
            togglePiP={actions.togglePiP}
            videoVariant={states.videoVariant}
          />

          <button className="control-btn fullscreen-btn" onClick={actions.toggleFullscreen}>
            {states.isFullscreen ? <IoContract /> : <IoExpand />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerControls;
