export const mapTag = (tag) => {
  if (!tag) return null;
  return { ...tag };
};

export const mapTags = (tags) => (Array.isArray(tags) ? tags.map(mapTag) : []);
