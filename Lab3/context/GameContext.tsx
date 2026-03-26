import React, { createContext, useContext, useReducer } from "react";

export interface GameState {
  score: number;
  tapCount: number;
  doubleTapCount: number;
  longPressCount: number;
  panCount: number;
  flingLeftCount: number;
  flingRightCount: number;
  pinchCount: number;
  longestHoldMs: number;
}

export type GameAction =
  | { type: "TAP" }
  | { type: "DOUBLE_TAP" }
  | { type: "LONG_PRESS" }
  | { type: "PAN" }
  | { type: "FLING_LEFT"; points: number }
  | { type: "FLING_RIGHT"; points: number }
  | { type: "PINCH" }
  | { type: "RECORD_HOLD"; durationMs: number };

const initialState: GameState = {
  score: 0,
  tapCount: 0,
  doubleTapCount: 0,
  longPressCount: 0,
  panCount: 0,
  flingLeftCount: 0,
  flingRightCount: 0,
  pinchCount: 0,
  longestHoldMs: 0,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "TAP":
      return { ...state, score: state.score + 1, tapCount: state.tapCount + 1 };
    case "DOUBLE_TAP":
      return {
        ...state,
        score: state.score + 2,
        doubleTapCount: state.doubleTapCount + 1,
      };
    case "LONG_PRESS":
      return {
        ...state,
        score: state.score + 5,
        longPressCount: state.longPressCount + 1,
      };
    case "PAN":
      return { ...state, panCount: state.panCount + 1 };
    case "FLING_LEFT":
      return {
        ...state,
        score: state.score + action.points,
        flingLeftCount: state.flingLeftCount + 1,
      };
    case "FLING_RIGHT":
      return {
        ...state,
        score: state.score + action.points,
        flingRightCount: state.flingRightCount + 1,
      };
    case "PINCH":
      return {
        ...state,
        score: state.score + 3,
        pinchCount: state.pinchCount + 1,
      };
    case "RECORD_HOLD":
      return {
        ...state,
        longestHoldMs: Math.max(state.longestHoldMs, action.durationMs),
      };
    default:
      return state;
  }
}

export interface Challenge {
  id: string;
  label: string;
  progress: number;
  target: number;
}

export function getChallenges(state: GameState): Challenge[] {
  return [
    {
      id: "tap10",
      label: "Натиснути 10 разів",
      progress: state.tapCount,
      target: 10,
    },
    {
      id: "doubleTap5",
      label: "Подвійний тап 5 разів",
      progress: state.doubleTapCount,
      target: 5,
    },
    {
      id: "longPress3s",
      label: "Утримувати 3 секунди",
      progress: state.longestHoldMs >= 3000 ? 1 : 0,
      target: 1,
    },
    {
      id: "pan",
      label: "Перемістити об'єкт",
      progress: Math.min(state.panCount, 1),
      target: 1,
    },
    {
      id: "fling",
      label: "Свайп вправо та вліво",
      progress:
        (state.flingLeftCount > 0 ? 1 : 0) +
        (state.flingRightCount > 0 ? 1 : 0),
      target: 2,
    },
    {
      id: "pinch",
      label: "Змінити розмір об'єкта",
      progress: Math.min(state.pinchCount, 1),
      target: 1,
    },
    {
      id: "score100",
      label: "Набрати 100 очок",
      progress: Math.min(state.score, 100),
      target: 100,
    },
    {
      id: "custom",
      label: "Зробити 50 тапів (особистий виклик)",
      progress: Math.min(state.tapCount, 50),
      target: 50,
    },
  ];
}

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType>({
  state: initialState,
  dispatch: () => {},
});

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);
