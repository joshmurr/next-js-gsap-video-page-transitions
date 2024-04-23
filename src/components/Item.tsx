import styled from "styled-components";

export const Item = styled.div<{ bg: string }>`
  width: var(--card-size);
  background-color: ${(props) => props.bg};
  display: flex;
  align-items: center;
  justify-content: center;
`;
