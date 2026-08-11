import { Link } from "react-router-dom";

const CardFooter = ({
  categoryIcon,
  categoryName,
  date,
  ownerAvatarUrl,
  ownerId,
  tags = [],
  title,
  userHandle,
}) => (
  <div className="card-footer">
    <div className="game-icon-container">
      <img src={categoryIcon} alt={categoryName} className="game-icon" />
    </div>
    <div className="card-details">
      <h3 className="video-title" title={title}>{title}</h3>
      <p className="game-name">{categoryName}</p>
      <div className="user-data">
        {ownerAvatarUrl && (
          <img
            className="user-avatar-mini"
            src={ownerAvatarUrl}
            alt={userHandle}
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        )}
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
      {tags.length > 0 && (
        <div className="card-tags">
          {tags.slice(0, 3).map((tag) => (
            <Link
              key={tag.id}
              className="card-tag"
              to={`/tags/${tag.id}`}
              title={`#${tag.name}`}
              onClick={(event) => event.stopPropagation()}
            >
              #{tag.name}
            </Link>
          ))}
          {tags.length > 3 && <span className="card-tag-more">+{tags.length - 3}</span>}
        </div>
      )}
    </div>
  </div>
);

export default CardFooter;
