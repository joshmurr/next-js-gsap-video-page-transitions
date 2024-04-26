import { ReactNode } from "react";
import { useGlobalState } from "@/hooks/useGlobalState";
import { usePreviousRoute } from "@/hooks/usePreviousRoute";
import { useEffect } from "react";

export function RouteTracker({ children }: { children: ReactNode }) {
  const previousRoute = usePreviousRoute();

  const { dispatch } = useGlobalState();

  useEffect(() => {
    dispatch({ type: "previousRoute", value: previousRoute });
  }, [dispatch, previousRoute]);

  return children;
}
