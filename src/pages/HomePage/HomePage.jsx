import React from "react";
import InfiniteVideoGrid from "../../components/videos/InfiniteVideoGrid/InfiniteVideoGrid";
import { useHomeVideos } from "./useHomeVideos";
import "./HomePage.css";

function HomePage() {
  const { 
    videos, 
    statusText, 
    hasMore, 
    isFetchingNextPage, 
    loadMoreVideos 
  } = useHomeVideos();

  return (
    <InfiniteVideoGrid 
      videos={videos}
      statusText={statusText}
      hasMore={hasMore}
      isFetchingNextPage={isFetchingNextPage}
      loadMoreVideos={loadMoreVideos}
    />
  );
}

export default HomePage;