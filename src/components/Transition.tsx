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

export const TransitionLayout = ({ children }: Props) => {
  const pathname = usePathname();
  const { toggleCompleted } = useTransitionState();
  const overlayRef = useRef<HTMLDivElement>(null);
  const exitComplete = useRef(false);
  const morphItemsEnter = useRef<NodeListOf<Element> | null>();

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
                if (overlayRef.current) {
                  const targetMorphId = morphEl.dataset.morphItem;
                  const targetEl = getMorphItems(entry, targetMorphId)[0];
                  Flip.fit(morphEl, targetEl, {
                    absolute: true,
                    duration: DURATION / 2,
                    onComplete: () => {
                      morphComplete = true;
                    },
                  });
                }
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
              const clone = morphEl.cloneNode(true);
              gsap.set(clone, { margin: 0, padding: 0 });
              const pagePosition = getPagePosition(morphEl);
              gsap.set(clone, {
                position: "absolute",
                top: pagePosition.y,
                left: pagePosition.x,
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
