import { useRouter } from "next/router";
import React, { createContext, useContext, useReducer, useRef } from "react";

type TransitionContextValue = {
  completed: boolean;
  toggleCompleted: (value: boolean) => void;
  previousRoute: string | null;
};

type TransitionContextAction = {
  type: "toggle";
  value: boolean;
};

const initialState: TransitionContextValue = {
  completed: false,
  toggleCompleted: () => {},
  previousRoute: "blue",
};

const TransitionContext = createContext<TransitionContextValue>(initialState);

const reducer = (
  prevState: TransitionContextValue,
  action: TransitionContextAction,
) => {
  switch (action.type) {
    case "toggle":
      return { ...prevState, completed: action.value };
    default:
      throw new Error();
  }
};

interface Props {
  children: React.ReactNode;
}

const TransitionProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();
  const routeRef = useRef<string | null>(null);

  router.events?.on("routeChangeStart", () => {
    routeRef.current = router.asPath;
  });

  const value = {
    ...state,
    previousRoute: routeRef.current,
    toggleCompleted: (value: boolean) => {
      dispatch({ type: "toggle", value });
    },
  };

  return (
    <TransitionContext.Provider value={value}>
      {children}
    </TransitionContext.Provider>
  );
};

const useTransitionState = () => {
  return useContext(TransitionContext);
};

export { TransitionContext, TransitionProvider, useTransitionState };
