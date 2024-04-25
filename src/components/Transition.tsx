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

const getPagePosition = (el: Element) => {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.x,
    y: rect.y,
  };
};

export const TransitionLayout = ({ children }: Props) => {
  const pathname = usePathname();
  const { toggleCompleted } = useTransitionState();

  const overlayRef = useRef<HTMLDivElement>(null);
  const exitComplete = useRef(false);

  const morphItemsEnter = useRef<NodeList>();

  return (
    <>
      <Overlay ref={overlayRef} />
      <SwitchTransition mode="in-out">
        <Transition
          key={pathname}
          timeout={DURATION * 1000}
          onEnter={(entry) => {
            let morphin = false;
            let morphComplete = false;

            gsap.set(entry, {
              position: "absolute",
              top: 0,
              left: 0,
              autoAlpha: 0,
            });

            const allPotentialMorphItem =
              entry.querySelectorAll("[data-morph-item]");
            morphItemsEnter.current = allPotentialMorphItem;

            const doMorph = () => {
              morphin = true;
              const morphItems =
                overlayRef.current.querySelectorAll("[data-morph-item]");
              morphItems.forEach((morphEl) => {
                if (overlayRef.current) {
                  const targetMorphId = morphEl.dataset.morphItem;
                  const targetEl = entry.querySelector(
                    `[data-morph-item="${targetMorphId}"]`,
                  );
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
              /* Polling as useEffect style callbacks are not use here */
              if (exitComplete.current) if (!morphin) doMorph();
              if (morphComplete) tl.play();
            }, 30);
          }}
          onExit={(exit) => {
            gsap.set(exit, {
              position: "absolute",
              top: 0,
              left: 0,
            });

            const enterIds = [...morphItemsEnter.current].map((item) => {
              return item.getAttribute("data-morph-item") || "";
            });
            const __morphItems = [
              ...exit.querySelectorAll("[data-morph-item]"),
            ].filter((item) => {
              const exitId = item.getAttribute("data-morph-item");
              return enterIds.includes(exitId);
            });

            __morphItems.forEach((morphEl) => {
              const clone = morphEl.cloneNode(true) as HTMLElement;
              gsap.set(clone, { margin: 0, padding: 0 });
              // Flip.fit(clone, morphEl, { absolute: true, duration: 0 });
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
