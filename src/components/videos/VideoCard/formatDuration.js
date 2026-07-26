export const formatDuration = (totalSeconds) => {
  if (totalSeconds === undefined || totalSeconds === null || Number.isNaN(totalSeconds)) {
    return "0:00";
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};
