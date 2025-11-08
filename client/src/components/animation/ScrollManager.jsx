// src/components/ScrollManager.jsx
import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// ✅ Handles smooth scroll and restoration
const ScrollManager = () => {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // Don't scroll when using browser back/forward (POP)
    if (navigationType !== "POP") {
      const timeout = setTimeout(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      }, 100); // Prevent DOM reflow jerk
      return () => clearTimeout(timeout);
    }
  }, [location.pathname, navigationType]);

  // 🧩 Future: useScrollRestoration() placeholder (React Router 7+)
  // const { restoreScroll } = useScrollRestoration();
  // useEffect(() => restoreScroll(), [restoreScroll]);

  return null;
};

export default ScrollManager;
