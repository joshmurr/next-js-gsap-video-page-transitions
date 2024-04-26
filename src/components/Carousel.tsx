import styled from "styled-components";
import {
  RefObject,
  createRef,
  useCallback,
  useLayoutEffect,
  useRef,
} from "react";
import useHorizontalScroll from "@/hooks/useHorizontalScroll";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Video } from "./Video";
import Link from "next/link";
import { Title } from "./Title";
import { useTransitionState } from "@/context/TransitionContext";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100vh;
  overflow-x: scroll;
  overflow-y: hidden;
`;

const Inner = styled.div`
  display: inline-grid;
  column-gap: 5vw;
  padding: 0 calc(50vw - (var(--card-size-large) / 2));
  grid-auto-flow: column;
  align-items: start;
`;

const ItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Btn = styled.button`
  position: fixed;
`;

interface Props {
  items: any[];
}

export const Carousel = ({ items }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  useHorizontalScroll(scrollRef);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<RefObject<HTMLDivElement>[]>([]);
  const firstLoadRef = useRef<boolean>(true);

  const { previousRoute } = useTransitionState();
  const previousProjectId = previousRoute?.startsWith("/work/")
    ? previousRoute.split("/")[2]
    : null;

  useLayoutEffect(() => {
    if (firstLoadRef.current) {
      firstLoadRef.current = false;
      return;
    }
    if (!previousProjectId) return;
    const idx = items.findIndex((item) => item === previousProjectId);
    const targetElementRef = itemRefs.current[idx];

    if (scrollRef.current && targetElementRef.current) {
      const container = scrollRef.current;
      const targetElement = targetElementRef.current;

      // Calculate the target element's offsetLeft relative to the container
      const targetOffsetLeft = targetElement.offsetLeft;
      // Calculate the center position of the target element
      const targetCenter = targetOffsetLeft + targetElement.offsetWidth / 2;
      // Calculate the scroll position needed to center the target element
      const containerCenter = container.offsetWidth / 2;
      const scrollPosition = targetCenter - containerCenter;

      // Set the container's scrollLeft to center the target element
      container.scrollLeft = scrollPosition;
    }
    // NOTE: We only want this to run once, as to not scroll the container
    // again after the first render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useGSAP(
    () => {
      /* Intro anims */
      const targets = gsap.utils.toArray(["[data-morph-item]"]);
      gsap.fromTo(targets, { opacity: 0 }, { opacity: 1, stagger: 0.3 });
    },
    { scope: containerRef },
  );

  return (
    <Wrapper ref={scrollRef} className="scroller">
      <Inner ref={containerRef}>
        {items.map((id, i) => (
          <ItemWrapper
            key={i}
            ref={(itemRefs.current[i] = itemRefs.current[i] || createRef())}
            data-scroll-to={id === previousProjectId ? "true" : "false"}
          >
            <Link href={`/work/${id}`} scroll={false}>
              <Title data-morph-item={`layout-title-${id}`} color={id}>
                Title {id}
              </Title>
              <Video data-morph-item={`layout-${id}`} />
            </Link>
          </ItemWrapper>
        ))}
      </Inner>
    </Wrapper>
  );
};
