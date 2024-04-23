import { useTransitionState } from "@/context/TransitionContext";
import { ReactElement, useEffect } from "react";

interface Props {
  id: string;
  children: ReactElement;
  childRef?: React.RefObject<HTMLElement>;
}

export const LayoutTransition = ({ id, childRef, children }: Props) => {
  const { update } = useTransitionState();

  useEffect(() => {
    /* Mount */
    if (!childRef?.current) {
      throw new Error(`Ref for element id "${id}" not found`);
    }
    const from = childRef.current.getBoundingClientRect();
    update(id, { from });
  }, [update, id, childRef]);

  return <>{children}</>;
};
