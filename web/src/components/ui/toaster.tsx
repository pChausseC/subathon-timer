"use client";

import { useCallback, useEffect } from "react";
import { ToastProvider, ToastViewport } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import {
  type ServerToClientEvents,
  useSocket,
} from "@/providers/socket-provider";
import { SubPopup } from "../sub-popup";

export function Toaster() {
  const { toast, toasts } = useToast();
  const { socket } = useSocket();
  const handleEvent: ServerToClientEvents["event"] = useCallback(
    (name, points, sender) => {
      if (!sender) toast({ name, points });
    },
    [toast],
  );
  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on("event", handleEvent);
    socket.on("gift", (name, amount) => {
      toast({ name, points: 0, amount });
    });
    return () => {
      socket?.off("event", handleEvent);
      socket?.off("gift");
    };
  }, [socket, handleEvent, toast]);
  return (
    <ToastProvider duration={5000}>
      {toasts.map(function ({ id, points, ...props }) {
        return <SubPopup key={id} initialPoints={points} {...props} />;
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
