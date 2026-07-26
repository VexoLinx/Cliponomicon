import { MdCloudUpload, MdError } from "react-icons/md";

const UpdateStatusPanel = ({ errorMessage, onRetry, status }) => (
  <div className="modal-status-centered">
    {status === "updating" && (
      <div className="upload-status uploading">
        <MdCloudUpload className="icon-spin" />
        <span className="file-name-scroll">Actualizando metadata...</span>
        <div className="progress-bar-container">
          <div className="progress-bar-fill"></div>
        </div>
        <p>Guardando los nuevos cambios en el servidor...</p>
      </div>
    )}

    {status === "deleting" && (
      <div className="upload-status deleting">
        <MdCloudUpload className="icon-spin" />
        <span className="file-name-scroll">Eliminando clip...</span>
        <div className="progress-bar-container">
          <div className="progress-bar-fill fill-complete"></div>
        </div>
        <p className="status-message">Borrando el archivo del servidor de forma permanente.</p>
      </div>
    )}

    {status === "success" && (
      <div className="upload-status success">
        <span className="status-title">Operacion exitosa</span>
        <p className="status-message">Los cambios se han aplicado correctamente.</p>
      </div>
    )}

    {status === "error" && (
      <div className="upload-status error">
        <MdError className="modal-error-icon" />
        <span className="status-title">Error en la solicitud</span>
        <p className="error-message">{errorMessage}</p>
        <button onClick={onRetry} className="btn-retry">
          Reintentar
        </button>
      </div>
    )}
  </div>
);

export default UpdateStatusPanel;
