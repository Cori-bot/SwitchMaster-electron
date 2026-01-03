import { useState, useEffect, useRef } from "react";

export interface ValorantState {
  state: "MENUS" | "PREGAME" | "INGAME" | "UNKNOWN";
  matchId?: string;
  mapId?: string;
  queueId?: string;
  players?: any[];
  teamSide?: string;
}

export const useValorantState = () => {
  const [valorantState, setValorantState] = useState<ValorantState>({ state: "UNKNOWN" });
  const [showAssistant, setShowAssistant] = useState(true);

  // Use a ref to access the latest state inside the event listener
  // without creating a new listener on every render (stale closure prevention)
  const stateRef = useRef(valorantState);

  useEffect(() => {
    stateRef.current = valorantState;
  }, [valorantState]);

  useEffect(() => {
    // Valorant State Listener
    const unsubVal = window.ipc.on("valorant-state", (_e, data: any) => {
      const prevData = stateRef.current;
      const newState = data.state;
      const prevState = prevData.state;

      // Auto-show assistant only when transitioning from UNKNOWN to an active state
      if (prevState === "UNKNOWN" && (newState === "MENUS" || newState === "PREGAME" || newState === "INGAME")) {
        setShowAssistant(true);
      }

      // Optimization: Prevent re-renders if data hasn't effectively changed.
      // We check key fields and players list content.
      const shouldUpdate =
        prevData.state !== newState ||
        prevData.matchId !== data.matchId ||
        prevData.mapId !== data.mapId ||
        prevData.queueId !== data.queueId ||
        prevData.teamSide !== data.teamSide ||
        JSON.stringify(prevData.players) !== JSON.stringify(data.players);

      if (shouldUpdate) {
        setValorantState(data);
      }
    });

    return () => {
      unsubVal();
    };
  }, []);

  return {
    valorantState,
    showAssistant,
    setShowAssistant
  };
};
