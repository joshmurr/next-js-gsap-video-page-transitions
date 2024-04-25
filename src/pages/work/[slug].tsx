import { PROJECT_IDS } from "@/data/projects";
import { InferGetStaticPropsType } from "next";
import { useRef } from "react";
import { Item } from "@/components/Item";
import styled from "styled-components";
import Link from "next/link";

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

const TranslatedItem = styled(Item)`
  margin-top: 50px;
  margin-left: 50px;
`;

const Title = styled.p`
  margin-bottom: 5em;
`;

export default function Work({ data }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <Container ref={containerRef}>
      <Link href={"/"} scroll={false}>
        <Title data-morph-item={`layout-title-${data.id}`}>
          Title {data.id}
        </Title>
      </Link>
      <Link href={"/"} scroll={false}>
        <TranslatedItem data-morph-item={`layout-${data.id}`} bg={data.id}>
          {data.id}
        </TranslatedItem>
      </Link>
    </Container>
  );
}
