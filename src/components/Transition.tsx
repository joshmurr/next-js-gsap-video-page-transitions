import { useRef } from "react";
import { SwitchTransition, Transition } from "react-transition-group";
import { useTransitionState } from "../context/TransitionContext";
import gsap from "gsap";
import Flip from "gsap/dist/Flip";
import ScrollToPlugin from "gsap/dist/ScrollToPlugin";
import styled from "styled-components";
import { usePathname } from "next/navigation";

gsap.registerPlugin(Flip, ScrollToPlugin);

const DURATION = 1;
gsap.defaults({
  ease: "power2.inOut",
  duration: 0.1,
});

interface Props {
  children: React.ReactNode;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
`;

const getPagePosition = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
  };
};

const getMorphItems = (el: HTMLElement, id: string | null = null) => {
  const selector = id ? `[data-morph-item=${id}]` : "[data-morph-item]";
  return el.querySelectorAll(selector) as NodeListOf<HTMLElement>;
};

const getMorphId = (el: HTMLElement) => {
  return el.getAttribute("data-morph-item");
};

const idIn = (arr: (string | null)[]) => {
  return (item: HTMLElement) => {
    const id = getMorphId(item);
    return arr.includes(id);
  };
};

const isVideo = (el: HTMLElement) => el.nodeName === "VIDEO";

export const TransitionLayout = ({ children }: Props) => {
  const pathname = usePathname();
  const { toggleCompleted } = useTransitionState();
  const overlayRef = useRef<HTMLDivElement>(null);
  const exitComplete = useRef(false);
  const morphItemsEnter = useRef<NodeListOf<Element> | null>();
  const videoTimeRef = useRef(0);

  return (
    <>
      <Overlay ref={overlayRef} />
      <SwitchTransition mode="in-out">
        <Transition<undefined>
          key={pathname}
          timeout={DURATION * 1000}
          onEnter={(entry) => {
            let morphin = false;
            let morphComplete = false;

            gsap.set(entry, {
              autoAlpha: 0,
            });

            morphItemsEnter.current = getMorphItems(entry);

            const doMorph = () => {
              morphin = true;
              if (!overlayRef.current) return;
              const exitMorphItems = getMorphItems(overlayRef.current);
              exitMorphItems.forEach((morphEl) => {
                if (isVideo(morphEl)) {
                  morphEl.currentTime = videoTimeRef.current;
                  morphEl.play();
                }
                const targetMorphId = morphEl.dataset.morphItem;
                const targetEl = getMorphItems(entry, targetMorphId)[0];
                const scale = ["VIDEO"].includes(targetEl.nodeName);
                Flip.fit(morphEl, targetEl, {
                  absolute: true,
                  scale,
                  duration: DURATION / 2,
                  onComplete: () => {
                    morphComplete = true;
                  },
                });
              });
            };

            const tl = gsap
              .timeline({
                paused: true,
                onComplete: () => {
                  clearInterval(intervalId);
                  toggleCompleted(true);
                  exitComplete.current = false;
                  if (overlayRef.current) overlayRef.current.innerHTML = "";
                },
              })
              .to(entry, {
                autoAlpha: 1,
                duration: DURATION / 2,
              });

            let intervalId = setInterval(() => {
              /* Polling as useEffect style callbacks are not use here
               * Also putting doMorph in a timeline.call() is tricky as we
               * can't get GSAP to time it or place a callback in the callback. */
              if (exitComplete.current) if (!morphin) doMorph();
              if (morphComplete) tl.play();
            }, 10);
          }}
          onExit={(exit) => {
            gsap.set(exit, {
              position: "absolute",
              top: 0,
              left: 0,
            });

            const enterIds = [...morphItemsEnter.current].map(getMorphId);
            const exitMorphItems = [...getMorphItems(exit)].filter(
              idIn(enterIds),
            );

            exitMorphItems.forEach((morphEl) => {
              let clone;
              if (isVideo(morphEl)) {
                morphEl.pause();
                const currentTime = morphEl.currentTime;
                videoTimeRef.current = currentTime;
                clone = morphEl.cloneNode(true) as HTMLVideoElement;
                clone.pause();
                clone.currentTime = currentTime;
              } else {
                clone = morphEl.cloneNode(true);
              }
              // const clone = morphEl.cloneNode(true);
              gsap.set(clone, { margin: 0 });
              const pagePosition = getPagePosition(morphEl);
              gsap.set(clone, {
                position: "absolute",
                ...pagePosition,
              });
              if (overlayRef.current) {
                overlayRef.current.appendChild(clone);
              }
            });

            gsap
              .timeline({
                paused: true,
                onComplete: () => {
                  exitComplete.current = true;
                },
              })
              .to(exit, {
                autoAlpha: 0,
                duration: DURATION / 2,
              })
              .set(window, { scrollTo: { x: 0, y: 0 } })
              .play();
          }}
        >
          {children}
        </Transition>
      </SwitchTransition>
    </>
  );
};
