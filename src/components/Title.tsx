import styled from "styled-components";

export const Title = styled.h3<{ color?: string }>`
  white-space: pre;
  color: ${({ color }) => color ?? "white"};
`;
