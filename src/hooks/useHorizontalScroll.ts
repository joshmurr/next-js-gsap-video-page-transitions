import { RefObject, useEffect } from "react";

const useHorizontalScroll = (ref: RefObject<HTMLElement>) => {
  useEffect(() => {
    const element = ref.current;

    const handleWheel = (event: WheelEvent) => {
      // Check if the event is primarily a horizontal scroll
      const isHorizontalScroll =
        Math.abs(event.deltaX) > Math.abs(event.deltaY);

      if (element && !isHorizontalScroll) {
        event.preventDefault(); // Prevent vertical scrolling
        element.scrollLeft += event.deltaY; // Translate vertical scroll to horizontal
      }
      // For genuine horizontal scroll, allow the default behavior
    };

    element?.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      element?.removeEventListener("wheel", handleWheel);
    };
  }, [ref]); // Depend on ref to re-apply the effect if the ref changes
};

export default useHorizontalScroll;
