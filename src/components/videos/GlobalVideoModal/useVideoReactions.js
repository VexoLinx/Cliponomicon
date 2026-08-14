import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addVideoReaction,
  deleteVideoReaction,
  listVideoReactions,
} from "../../../services/api/interactions.api";

const REACTION_TYPES = [
  { type: "like", label: "Me gusta" },
  { type: "laugh", label: "Risa" },
  { type: "wow", label: "Wow" },
];

const normalizeCounts = (reactions = []) =>
  REACTION_TYPES.reduce(
    (counts, reaction) => ({
      ...counts,
      [reaction.type]: Number(counts[reaction.type]) || 0,
    }),
    Object.fromEntries(
      reactions
        .filter((reaction) => reaction?.type)
        .map((reaction) => [reaction.type, Number(reaction.count) || 0]),
    ),
  );

const applyReactionChange = (counts, previousType, nextType) => {
  const nextCounts = { ...counts };

  if (previousType) {
    nextCounts[previousType] = Math.max(0, (nextCounts[previousType] || 0) - 1);
  }

  if (nextType) {
    nextCounts[nextType] = (nextCounts[nextType] || 0) + 1;
  }

  return nextCounts;
};

export const useVideoReactions = ({ activeVideo, token, updateActiveVideo }) => {
  const [currentReaction, setCurrentReaction] = useState(null);
  const [isUpdatingReaction, setIsUpdatingReaction] = useState(false);

  const reactionCounts = useMemo(
    () => normalizeCounts(activeVideo?.reactions),
    [activeVideo?.reactions],
  );

  useEffect(() => {
    setCurrentReaction(null);

    if (!token || !activeVideo?.id) return;

    let isMounted = true;

    listVideoReactions(activeVideo.id, { token })
      .then((reactions) => {
        if (!isMounted) return;
        setCurrentReaction(reactions?.[0]?.reactionType || reactions?.[0]?.reaction_type || null);
      })
      .catch((error) => {
        console.error("Error cargando reacciones del usuario:", error);
      });

    return () => {
      isMounted = false;
    };
  }, [activeVideo?.id, token]);

  const syncReactionCounts = useCallback((previousType, nextType) => {
    updateActiveVideo((video) => {
      const nextCounts = applyReactionChange(normalizeCounts(video.reactions), previousType, nextType);
      return {
        ...video,
        reactions: REACTION_TYPES.map(({ type }) => ({
          type,
          count: nextCounts[type] || 0,
        })),
      };
    });
  }, [updateActiveVideo]);

  const toggleReaction = useCallback(async (reactionType) => {
    if (!token || !activeVideo?.id || isUpdatingReaction) return;

    const previousReaction = currentReaction;
    const nextReaction = previousReaction === reactionType ? null : reactionType;

    setCurrentReaction(nextReaction);
    syncReactionCounts(previousReaction, nextReaction);
    setIsUpdatingReaction(true);

    try {
      if (previousReaction) {
        await deleteVideoReaction(activeVideo.id, { token });
      }

      if (nextReaction) {
        await addVideoReaction(activeVideo.id, nextReaction, { token });
      }
    } catch (error) {
      setCurrentReaction(previousReaction);
      syncReactionCounts(nextReaction, previousReaction);
      console.error("Error actualizando reaccion:", error);
    } finally {
      setIsUpdatingReaction(false);
    }
  }, [
    activeVideo?.id,
    currentReaction,
    isUpdatingReaction,
    syncReactionCounts,
    token,
  ]);

  return {
    currentReaction,
    isUpdatingReaction,
    reactionCounts,
    reactionTypes: REACTION_TYPES,
    toggleReaction,
  };
};
