import { Carousel } from "@/components/Carousel";
import { PROJECT_IDS } from "@/data/projects";

export default function Home() {
  return (
    <main>
      <Carousel items={PROJECT_IDS} />
    </main>
  );
}
