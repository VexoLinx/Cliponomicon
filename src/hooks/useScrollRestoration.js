// src/hooks/useScrollRestoration.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const scrollPositions = new Map();

export const useScrollRestoration = (containerRef) => {
  const location = useLocation();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const target = scrollPositions.get(location.pathname) ?? 0;
    let done = target === 0;

    const tryRestore = () => {
      if (done) return;

      const maxScroll = container.scrollHeight - container.clientHeight;

      if (maxScroll >= target) {
        container.scrollTop = target;
        done = true;
        resizeObserver.disconnect();
        clearTimeout(giveUpTimer);
      } else {
        container.scrollTop = maxScroll;
      }
    };

    const resizeObserver = new ResizeObserver(tryRestore);
    resizeObserver.observe(container);

    tryRestore();

    const giveUpTimer = setTimeout(() => {
      done = true;
      resizeObserver.disconnect();
    }, 3000);

    const handleScroll = () => {
      scrollPositions.set(location.pathname, container.scrollTop);
    };
    container.addEventListener("scroll", handleScroll);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(giveUpTimer);
      container.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname, containerRef]);
};