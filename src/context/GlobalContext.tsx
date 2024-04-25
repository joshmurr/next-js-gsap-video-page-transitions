import React, {
  createContext,
  useReducer,
  ReactNode,
  Dispatch,
  useContext,
} from "react";

type GlobalContextValue = {
  projectId: string | undefined;
  previousRoute: string | null;
};

type GlobalContextAction =
  | { type: "projectId"; value: string }
  | { type: "previousRoute"; value: string | null };

const initialState: GlobalContextValue = {
  projectId: undefined,
  previousRoute: null,
};

const GlobalContext = createContext<{
  state: GlobalContextValue;
  dispatch: Dispatch<GlobalContextAction>;
}>({
  state: initialState,
  dispatch: () => {}, // Provide a default value or specify the actual dispatch function
});

type Props = {
  children: ReactNode;
};

const reducer = (
  prevState: GlobalContextValue,
  action: GlobalContextAction,
) => {
  switch (action.type) {
    case "previousRoute":
      return { ...prevState, previousRoute: action.value };
    case "projectId":
      return { ...prevState, projectId: action.value };
    default:
      throw new Error();
  }
};

const GlobalStateProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};

const useGlobalState = () => {
  const { state, dispatch } = useContext(GlobalContext);

  if (state === undefined) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }

  return { state, dispatch };
};

export { GlobalContext as store, GlobalStateProvider, useGlobalState };
