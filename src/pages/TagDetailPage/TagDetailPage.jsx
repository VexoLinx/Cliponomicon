import { useParams } from "react-router-dom";
import InfiniteVideoGrid from "../../components/videos/InfiniteVideoGrid/InfiniteVideoGrid";
import { useTagVideos } from "./useTagVideos";
import "./TagDetailPage.css";

const TagDetailPage = () => {
  const { tagId } = useParams();
  const {
    error,
    hasMore,
    isFetchingNextPage,
    loadMoreVideos,
    loading,
    tag,
    videos,
  } = useTagVideos(tagId);

  if (loading) {
    return (
      <div className="page-container">
        <p className="grid-status-text">Cargando clips...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <p className="grid-status-text">{error}</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      {tag && (
        <header className="tag-detail-header">
          <h1>#{tag.name}</h1>
        </header>
      )}
      <InfiniteVideoGrid
        videos={videos}
        statusText={videos.length === 0 ? "Aun no hay clips para este tag." : ""}
        hasMore={hasMore}
        isFetchingNextPage={isFetchingNextPage}
        loadMoreVideos={loadMoreVideos}
      />
    </div>
  );
};

export default TagDetailPage;
