import React from "react";
import { 
  IoPlay, IoPause, IoVolumeHigh, IoVolumeMute, 
  IoExpand, IoContract, IoSettingsSharp, IoChevronForward,
  IoChevronBack, IoDownloadOutline, IoCopyOutline 
} from "react-icons/io5";
import { useVideoPlayer } from "./useVideoPlayer";
import "./CustomVideoPlayer.css";

const CustomVideoPlayer = ({ video }) => {
  const { refs, states, actions } = useVideoPlayer(video);

  const { videoRef, playerContainerRef, settingsRef } = refs;
  const {
    isPlaying, progress, currentTime, duration, volume,
    isMuted, isFullscreen, activeMenu, videoVariant,
    playbackRate, isDownloading, currentStreamUrl
  } = states;
  const {
    togglePlay, handleTimeUpdate, handleLoadedMetadata,
    handleVideoEnd, handleSeek, toggleMute, handleVolumeChange,
    toggleFullscreen, handleVideoError, setActiveMenu,
    changeQuality, changeSpeed, togglePiP, handleDownload
  } = actions;

  const currentVolume = isMuted ? 0 : volume;

  return (
    <div className="custom-player-wrapper" ref={playerContainerRef}>
      {video?.edited && (
        <div className="edited-bookmark modal-bookmark" title="Este clip está editado">
          <span className="bookmark-text">EDIT</span>
        </div>
      )}

      <video
        ref={videoRef}
        className="custom-video-element"
        src={currentStreamUrl}
        autoPlay
        playsInline
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleVideoEnd}
        onError={handleVideoError}
      />

      <div className="custom-controls-bar">
        <input 
          type="range" 
          className="progress-slider" 
          min="0" 
          max="100" 
          value={progress} 
          onChange={handleSeek}
          style={{ "--progress": `${progress}%` }}
        />

        <div className="controls-row">
          <div className="controls-left">
            <button className="control-btn play-btn" onClick={togglePlay}>
              {isPlaying ? <IoPause /> : <IoPlay />}
            </button>
            
            <div className="volume-container">
              <button className="control-btn" onClick={toggleMute}>
                {isMuted || volume === 0 ? <IoVolumeMute /> : <IoVolumeHigh />}
              </button>
              <input 
                type="range" 
                className="volume-slider" 
                min="0" 
                max="1" 
                step="0.05" 
                value={currentVolume} 
                onChange={handleVolumeChange} 
                style={{ "--volume": `${currentVolume * 100}%` }}
              />
            </div>

            <span className="time-display">{currentTime} / {duration}</span>
          </div>

          <div className="controls-right">
            
            {/* MENÚ DE AJUSTES AVANZADOS */}
            <div className="settings-container-btn" ref={settingsRef}>
              <button 
                className={`control-btn ${activeMenu ? 'active' : ''}`} 
                onClick={() => setActiveMenu(activeMenu ? null : 'main')}
              >
                <IoSettingsSharp />
              </button>

              {activeMenu && (
                <>
                  <div 
                    className="settings-overlay" 
                    onClick={(e) => {
                      e.stopPropagation(); 
                      setActiveMenu(null); 
                    }}
                  />
                  
                  <div 
                    className="settings-dropdown"
                    onClick={(e) => e.stopPropagation()} 
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    {activeMenu === 'main' && (
                      <>
                        <div className="settings-item" onClick={() => setActiveMenu('quality')}>
                          <span>Calidad</span>
                          <div className="settings-item-right">
                            <span>{videoVariant === 'low_h264' ? 'Baja' : 'Original'}</span>
                            <IoChevronForward />
                          </div>
                        </div>
                        <div className="settings-item" onClick={() => setActiveMenu('speed')}>
                          <span>Velocidad</span>
                          <div className="settings-item-right">
                            <span>{playbackRate === 1 ? 'Normal' : `${playbackRate}x`}</span>
                            <IoChevronForward />
                          </div>
                        </div>
                        <div className="settings-item" onClick={togglePiP}>
                          <span>Imagen en imagen</span>
                          <IoCopyOutline />
                        </div>
                        <div className="settings-item" onClick={handleDownload} style={{ opacity: isDownloading ? 0.5 : 1 }}>
                          <span>{isDownloading ? 'Descargando...' : 'Descargar'}</span>
                          <IoDownloadOutline />
                        </div>
                      </>
                    )}

                    {activeMenu === 'quality' && (
                      <>
                        <div className="settings-header" onClick={() => setActiveMenu('main')}>
                          <IoChevronBack /> <span>Calidad</span>
                        </div>
                        <div 
                          className={`settings-item ${videoVariant === "original" || videoVariant === "edited" ? "active" : ""}`}
                          onClick={() => changeQuality(video?.edited ? "edited" : "original")}
                        >
                          Original
                        </div>
                        <div 
                          className={`settings-item ${videoVariant === "low_h264" ? "active" : ""}`}
                          onClick={() => changeQuality("low_h264")}
                        >
                          Baja (low_h264)
                        </div>
                      </>
                    )}

                    {activeMenu === 'speed' && (
                      <>
                        <div className="settings-header" onClick={() => setActiveMenu('main')}>
                          <IoChevronBack /> <span>Velocidad</span>
                        </div>
                        {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                          <div 
                            key={rate}
                            className={`settings-item ${playbackRate === rate ? "active" : ""}`}
                            onClick={() => changeSpeed(rate)}
                          >
                            {rate === 1 ? 'Normal' : `${rate}x`}
                          </div>
                        ))}
                      </>
                    )}

                  </div>
                </>
              )}
            </div>

            <button className="control-btn fullscreen-btn" onClick={toggleFullscreen}>
              {isFullscreen ? <IoContract /> : <IoExpand />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomVideoPlayer;