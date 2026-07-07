import { createContext, useContext } from "react";
import { useWebSocket } from "../hooks";

type WebSocketContextType = ReturnType<typeof useWebSocket>;

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
    const ws = useWebSocket('ws://localhost:3001');
    return <WebSocketContext.Provider value={ws}>{children}</WebSocketContext.Provider>;
}


export const usePorkChop = () => {
    const ctx = useContext(WebSocketContext);
    if (!ctx) throw new Error('usePorkChop must be used inside WebSocketProvider');
    return ctx;
};