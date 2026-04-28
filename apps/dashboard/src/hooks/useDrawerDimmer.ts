import { useEffect } from "react";
import { useOverlayStore } from "../store/overlayStore";

/** Call inside any drawer/modal to automatically dim the sidebar when open. */
export function useDrawerDimmer(isOpen: boolean) {
  const pushOverlay = useOverlayStore((s) => s.pushOverlay);
  const popOverlay = useOverlayStore((s) => s.popOverlay);

  useEffect(() => {
    if (!isOpen) return;
    pushOverlay();
    return () => popOverlay();
  }, [isOpen, pushOverlay, popOverlay]);
}
