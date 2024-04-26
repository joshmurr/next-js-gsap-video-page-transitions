import { TransitionLayout } from "@/components/Transition";
import { TransitionProvider } from "@/context/TransitionContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <TransitionProvider>
      <TransitionLayout>
        <Component key={router.route} {...pageProps} />
      </TransitionLayout>
    </TransitionProvider>
  );
}
