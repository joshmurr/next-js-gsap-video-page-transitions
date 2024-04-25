import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";

/* const xor = <T,>(arr: T[], val: T) => {
  if (arr.includes(val)) return arr.filter((v) => v !== val);
  return [...arr, val];
}; */

type TransitionContextValue = {
  completed: boolean;
  morphItems: string[];
  toggleCompleted: (value: boolean) => void;
  addMorphItem: (value: string) => void;
  clearMorphItems: () => void;
};

type TransitionContextAction =
  | {
      type: "toggle";
      value: boolean;
    }
  | {
      type: "addMorphItem";
      value: string;
    }
  | {
      type: "clearMorphItems";
    };

const initialState: TransitionContextValue = {
  completed: false,
  morphItems: [],
  toggleCompleted: () => {},
  addMorphItem: () => {},
  clearMorphItems: () => {},
};

const TransitionContext = createContext<TransitionContextValue>(initialState);

const reducer = (
  prevState: TransitionContextValue,
  action: TransitionContextAction,
) => {
  switch (action.type) {
    case "toggle":
      return { ...prevState, completed: action.value };
    case "addMorphItem":
      return {
        ...prevState,
        morphItems: [...prevState.morphItems, action.value],
      };
    case "clearMorphItems":
      return { ...prevState, morphItems: [] };
    default:
      throw new Error();
  }
};

interface Props {
  children: React.ReactNode;
}

const TransitionProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = {
    ...state,
    toggleCompleted: (value: boolean) => {
      dispatch({ type: "toggle", value });
    },
    addMorphItem: (value: string) => {
      dispatch({ type: "addMorphItem", value });
    },
    clearMorphItems: () => {
      dispatch({ type: "clearMorphItems" });
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
