import { PROJECT_IDS } from "@/data/projects";
import { InferGetStaticPropsType } from "next";
import { useRef } from "react";
import { Video } from "@/components/Video";
import styled from "styled-components";
import Link from "next/link";
import { Title } from "@/components/Title";

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

const PageWrapper = styled.main`
  width: 100%;
`;

const Container = styled.div`
  width: 60%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ItemWithMargin = styled(Video)`
  width: 100%;
`;

const TitleWithMargin = styled(Title)`
  margin-bottom: 5em;
`;

const DummyContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 120vh;
  background-color: grey;
`;

export default function Work({ data }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <PageWrapper>
      <Container ref={containerRef}>
        <Link href={"/"} scroll={false}>
          <TitleWithMargin data-morph-item={`layout-title-${data.id}`}>
            Title {data.id}
          </TitleWithMargin>
          <ItemWithMargin data-morph-item={`layout-${data.id}`} bg={data.id}>
            {data.id}
          </ItemWithMargin>
        </Link>

        <DummyContent />

        <Link href={`/work/${data.nextProject.id}`} scroll={false}>
          <TitleWithMargin
            data-morph-item={`layout-title-${data.nextProject.id}`}
          >
            Title {data.nextProject.id}
          </TitleWithMargin>
          <ItemWithMargin
            data-morph-item={`layout-${data.nextProject.id}`}
            bg={data.nextProject.id}
          >
            {data.id}
          </ItemWithMargin>
        </Link>
      </Container>
    </PageWrapper>
  );
}
