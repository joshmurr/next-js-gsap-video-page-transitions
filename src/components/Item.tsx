import { forwardRef } from "react";
import styled from "styled-components";
import { LayoutTransition } from "./LayoutTransition";

const ItemEl = styled.div<{ bg: string }>`
  width: var(--card-size);
  background-color: ${(props) => props.bg};
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface Props {
  bg: string;
  id: string;
  children: React.ReactNode;
}

export const Item = forwardRef<HTMLDivElement, Props>(
  ({ bg, id, children }, ref) => {
    return (
      <LayoutTransition id={id} childRef={ref}>
        <ItemEl ref={ref} bg={bg}>
          {children}
        </ItemEl>
      </LayoutTransition>
    );
  },
);

Item.displayName = "Item";
