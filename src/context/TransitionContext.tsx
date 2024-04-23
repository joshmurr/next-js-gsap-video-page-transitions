import React, { createContext } from "react";
import { useState } from "react";

type TransitionContextValue = {
  completed: boolean;
  toggleCompleted: (value: boolean) => void;
};

const TransitionContext = createContext<TransitionContextValue>({
  completed: false,
  toggleCompleted: () => {},
});

interface Props {
  children: React.ReactNode;
}

export const TransitionProvider = ({ children }: Props) => {
  const [completed, setCompleted] = useState(false);

  const toggleCompleted = (value: boolean) => {
    setCompleted(value);
  };

  return (
    <TransitionContext.Provider
      value={{
        toggleCompleted,
        completed,
      }}
    >
      {children}
    </TransitionContext.Provider>
  );
};

export default TransitionContext;
