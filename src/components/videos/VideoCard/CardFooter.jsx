import { Link } from "react-router-dom";

const CardFooter = ({ categoryIcon, categoryName, date, ownerId, title, userHandle }) => (
  <div className="card-footer">
    <div className="game-icon-container">
      <img src={categoryIcon} alt={categoryName} className="game-icon" />
    </div>
    <div className="card-details">
      <h3 className="video-title" title={title}>{title}</h3>
      <p className="game-name">{categoryName}</p>
      <div className="user-data">
        {ownerId ? (
          <Link
            className="user-handle"
            title={userHandle}
            to={`/users/${ownerId}`}
            onClick={(event) => event.stopPropagation()}
          >
            {userHandle}
          </Link>
        ) : (
          <span className="user-handle" title={userHandle}>{userHandle}</span>
        )}
        <p className="separador">-</p>
        <p className="upload-date">{date}</p>
      </div>
    </div>
  </div>
);

export default CardFooter;
