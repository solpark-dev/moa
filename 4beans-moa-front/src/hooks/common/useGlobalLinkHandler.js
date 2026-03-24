import { useEffect } from "react";

export const useGlobalLinkHandler = () => {
  useEffect(() => {
    const handler = (e) => {
      const linkButton = e.target.closest("button[role='link']");
      if (!linkButton) return;

      const href = linkButton.dataset.href;
      if (!href) return;

      window.location.href = href;
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);
};
