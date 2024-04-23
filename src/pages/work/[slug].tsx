import { PROJECT_IDS } from "@/data/projects";
import { InferGetStaticPropsType } from "next";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useTransitionState } from "@/context/TransitionContext";
import { useEffect, useRef } from "react";
import { Item } from "@/components/Item";
import styled from "styled-components";

export async function getStaticPaths() {
  return {
    paths: PROJECT_IDS.map((id) => ({
      params: { slug: id },
    })),
    fallback: false,
  };
}

export async function getStaticProps(context: { params: { slug: string } }) {
  const { slug: id = "" } = context.params;

  const currentIdx = PROJECT_IDS.findIndex((otherId) => otherId === id);
  const nextIdx = (currentIdx + 1) % PROJECT_IDS.length;
  const nextId = PROJECT_IDS[nextIdx];

  return {
    props: {
      data: {
        id,
        slug: id,
        item: PROJECT_IDS[currentIdx],
        nextProject: {
          id: nextId,
        },
      },
    },
  };
}

interface Props extends InferGetStaticPropsType<typeof getStaticProps> {}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
`;

export default function Work({ data }: Props) {
  const { timeline } = useTransitionState();
  const containerRef = useRef<HTMLDivElement>(null);

  const itemRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      timeline.add(gsap.to(containerRef.current, { opacity: 0 }));
    },
    { scope: containerRef },
  );

  return (
    <Container ref={containerRef}>
      <Item ref={itemRef} bg={`#${data.id}`}>
        {data.id}
      </Item>
    </Container>
  );
}
