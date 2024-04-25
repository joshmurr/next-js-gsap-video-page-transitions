import styled from "styled-components";

const VideoEl = styled.video`
  width: var(--card-size-large);
`;

interface Props {}

export const Video = ({ ...rest }: Props) => (
  <VideoEl autoPlay muted loop playsInline {...rest}>
    <source
      src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm"
      type="video/webm"
    />
    <source
      src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      type="video/mp4"
    />
  </VideoEl>
);
