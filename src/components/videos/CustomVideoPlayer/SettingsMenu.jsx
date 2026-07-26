import {
  IoChevronBack,
  IoChevronForward,
  IoCopyOutline,
  IoDownloadOutline,
  IoSettingsSharp,
} from "react-icons/io5";

const SPEED_OPTIONS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];

const SettingsMenu = ({
  activeMenu,
  availableVariants,
  changeQuality,
  changeSpeed,
  handleDownload,
  isDownloading,
  playbackRate,
  setActiveMenu,
  settingsRef,
  togglePiP,
  videoVariant,
}) => (
  <div className="settings-container-btn" ref={settingsRef}>
    <button
      className={`control-btn ${activeMenu ? "active" : ""}`}
      onClick={() => setActiveMenu(activeMenu ? null : "main")}
    >
      <IoSettingsSharp />
    </button>

    {activeMenu && (
      <>
        <div
          className="settings-overlay"
          onClick={(event) => {
            event.stopPropagation();
            setActiveMenu(null);
          }}
        />

        <div
          className="settings-dropdown"
          onClick={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
        >
          {activeMenu === "main" && (
            <>
              <div className="settings-item" onClick={() => setActiveMenu("quality")}>
                <span>Calidad</span>
                <div className="settings-item-right">
                  <span>{videoVariant}</span>
                  <IoChevronForward />
                </div>
              </div>
              <div className="settings-item" onClick={() => setActiveMenu("speed")}>
                <span>Velocidad</span>
                <div className="settings-item-right">
                  <span>{playbackRate === 1 ? "Normal" : `${playbackRate}x`}</span>
                  <IoChevronForward />
                </div>
              </div>
              <div className="settings-item" onClick={togglePiP}>
                <span>Imagen en imagen</span>
                <IoCopyOutline />
              </div>
              <div
                className="settings-item"
                onClick={handleDownload}
                style={{ opacity: isDownloading ? 0.5 : 1 }}
              >
                <span>{isDownloading ? "Descargando..." : "Descargar"}</span>
                <IoDownloadOutline />
              </div>
            </>
          )}

          {activeMenu === "quality" && (
            <>
              <div className="settings-header" onClick={() => setActiveMenu("main")}>
                <IoChevronBack /> <span>Calidad</span>
              </div>
              {availableVariants.map((variant) => (
                <div
                  key={variant}
                  className={`settings-item ${videoVariant === variant ? "active" : ""}`}
                  onClick={() => changeQuality(variant)}
                >
                  {variant}
                </div>
              ))}
            </>
          )}

          {activeMenu === "speed" && (
            <>
              <div className="settings-header" onClick={() => setActiveMenu("main")}>
                <IoChevronBack /> <span>Velocidad</span>
              </div>
              {SPEED_OPTIONS.map((rate) => (
                <div
                  key={rate}
                  className={`settings-item ${playbackRate === rate ? "active" : ""}`}
                  onClick={() => changeSpeed(rate)}
                >
                  {rate === 1 ? "Normal" : `${rate}x`}
                </div>
              ))}
            </>
          )}
        </div>
      </>
    )}
  </div>
);

export default SettingsMenu;
