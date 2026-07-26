export const mapReactionCount = (reaction) => {
  if (!reaction) return null;
  return { ...reaction };
};

export const mapReactionCounts = (reactions) =>
  Array.isArray(reactions) ? reactions.map(mapReactionCount) : [];

export const mapVideoReaction = (reaction) => {
  if (!reaction) return null;

  return {
    ...reaction,
    videoId: reaction.video_id,
    userId: reaction.user_id,
    reactionType: reaction.reaction_type,
    createdAt: reaction.created_at,
    updatedAt: reaction.updated_at,
  };
};

export const mapVideoReactions = (reactions) =>
  Array.isArray(reactions) ? reactions.map(mapVideoReaction) : [];
