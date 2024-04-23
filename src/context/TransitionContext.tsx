import React, {
  createContext,
  ReactNode,
  useReducer,
  useContext,
  useMemo,
} from "react";
import gsap from "gsap";

type Viewport = {
  top: number;
  left: number;
  height: number;
  width: number;
};

type FromToViewport = {
  from?: Viewport;
  to?: Viewport;
};

type LayoutId = string;

type TransitionContextValue = {
  timeline: gsap.core.Timeline;
  layoutElements: Map<LayoutId, FromToViewport>;
  update: (key: string, value: FromToViewport) => void;
};

type TransitionContextAction = {
  type: "update";
  value: {
    id: string;
    values: FromToViewport;
  };
};

const initialState: TransitionContextValue = {
  timeline: gsap.timeline({ paused: true }),
  layoutElements: new Map(),
  update: () => {},
};

const TransitionContext = createContext<TransitionContextValue>(initialState);

interface Props {
  children: ReactNode;
}

const update = (
  map: TransitionContextValue["layoutElements"],
  key: string,
  value: FromToViewport,
) => {
  const m = new Map(map);
  const prevVal = map.get(key);
  if (!prevVal) {
    m.set(key, value);
    return m;
  }

  m.set(key, { ...prevVal, ...value });

  return m;
};

const reducer = (
  prevState: TransitionContextValue,
  action: TransitionContextAction,
) => {
  switch (action.type) {
    case "update":
      return {
        ...prevState,
        layoutElements: update(
          prevState.layoutElements,
          action.value.id,
          action.value.values,
        ),
      };
    default:
      throw new Error();
  }
};

const TransitionProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(
    () => ({
      ...state,
      update: (id: string, values: FromToViewport) => {
        dispatch({ type: "update", value: { id, values } });
      },
    }),
    [state],
  );

  return (
    <TransitionContext.Provider value={value}>
      {children}
    </TransitionContext.Provider>
  );
};

const useTransitionState = () => {
  const value = useContext(TransitionContext);

  if (value === undefined) {
    throw new Error(
      "useTransitionState must be used within a TransitionProvider",
    );
  }

  return value;
};

export { TransitionContext, TransitionProvider, useTransitionState };
