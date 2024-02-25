"use client";

import { env } from "@/env";
import { type DefaultEventsMap } from "@socket.io/component-emitter";
import { createContext, useContext, useEffect, useState } from "react";
import { io as ClientIO, type Socket } from "socket.io-client";

interface ServerToClientEvents {
  timeUpdate: (days: string, time: string) => void;
  timeElapsed: (time: string) => void;
  event: (username: string, points: number) => void;
  progress: (points: number) => void;
  goal: (goal: string) => void;
}
export interface ClientToServerEvents {
  start: () => void;
  stop: () => void;
  test: () => void;
  setGoal: (goal: string) => void;
}
type SocketContextType = {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket<
    DefaultEventsMap,
    DefaultEventsMap
  > | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  useEffect(() => {
    const socketInstance = ClientIO(env.NEXT_PUBLIC_SOCKET_URL);
    socketInstance.on("connect", () => {
      setIsConnected(true);
    });
    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });
    setSocket(socketInstance);
    return () => {
      socketInstance.disconnect();
    };
  }, []);
  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
