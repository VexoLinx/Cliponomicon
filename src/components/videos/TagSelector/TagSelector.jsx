const toggleTagId = (tagIds, tagId) =>
  tagIds.includes(tagId) ? tagIds.filter((id) => id !== tagId) : [...tagIds, tagId];

const TagSelector = ({ disabled = false, selectedTagIds = [], setSelectedTagIds, tags = [] }) => (
  <div className="video-tag-selector">
    <label className="input-label">Tags</label>
    <div className="video-tag-chip-list">
      {tags.length === 0 ? (
        <span className="video-tag-empty">No hay tags disponibles.</span>
      ) : (
        tags.map((tag) => {
          const tagId = String(tag.id);
          const isSelected = selectedTagIds.includes(tagId);

          return (
            <button
              key={tag.id}
              className={`video-tag-chip ${isSelected ? "selected" : ""}`}
              type="button"
              disabled={disabled}
              onClick={() => setSelectedTagIds(toggleTagId(selectedTagIds, tagId))}
            >
              #{tag.name}
            </button>
          );
        })
      )}
    </div>
  </div>
);

export default TagSelector;
