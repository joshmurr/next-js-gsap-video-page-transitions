import { useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollToPlugin from "gsap/ScrollToPlugin";
import Flip from "gsap/Flip";
import { useTransitionState } from "@/context/TransitionContext";
import styled from "styled-components";
import { useGlobalState } from "@/context/GlobalContext";
import { usePathname } from "next/navigation";
gsap.registerPlugin(useGSAP, ScrollToPlugin, Flip);

const HiddenWrapper = styled.div`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

interface Props {
  children: JSX.Element;
}

export const TransitionLayout = ({ children: incomingChildren }: Props) => {
  const [displayChildren, setDisplayChildren] = useState(incomingChildren);
  const { timeline } = useTransitionState();
  const { dispatch } = useGlobalState();
  const { contextSafe } = useGSAP();
  const pathname = usePathname();

  useEffect(() => {
    dispatch({
      type: "projectId",
      value: pathname.split("/")[2],
    });
  }, [pathname, dispatch]);

  const exit = contextSafe(() => {
    timeline.play().then(() => {
      window.scrollTo(0, 0);
      setDisplayChildren(incomingChildren);
      timeline.pause().clear();
    });
  });

  useGSAP(() => {
    if (incomingChildren.key !== displayChildren.key) {
      exit();
    }
  }, [incomingChildren]);

  return (
    <>
      {incomingChildren && <HiddenWrapper>{incomingChildren}</HiddenWrapper>}
      <div>{displayChildren}</div>
    </>
  );
};
