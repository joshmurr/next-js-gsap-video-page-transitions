// import { TransitionLayout } from "@/components/Transition";
import { GlobalStateProvider } from "@/context/GlobalContext";
import { TransitionProvider } from "@/context/TransitionContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <GlobalStateProvider>
      <TransitionProvider>
        <Component key={router.route} {...pageProps} />
      </TransitionProvider>
    </GlobalStateProvider>
  );
}
