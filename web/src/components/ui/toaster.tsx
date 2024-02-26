"use client";

import { useEffect } from "react";
import {
  ToastProvider,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useSocket } from "@/providers/socket-provider";
import { SubPopup } from "../sub-popup";

export function Toaster() {
  const { toast, toasts } = useToast();
  const { socket } = useSocket();
  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on("event", (name, points, sender) => {
      if (!sender) toast({ name, points });
    });
    socket.on("gift", (name) => {
      toast({ name, points: 0 });
    });
    return () => {
      socket?.off("event");
      socket?.off("gift");
    };
  }, [socket, toast]);
  return (
    <ToastProvider duration={10000000}>
      {toasts.map(function ({ id, name, points, ...props }) {
        return (
          <SubPopup key={id} name={name} initialPoints={points} {...props} />
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
