"use client";

import { useEffect } from "react";
import {
  Toast,
  ToastDescription,
  ToastProvider,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useSocket } from "@/providers/socket-provider";

export function Toaster() {
  const { toast, toasts } = useToast();
  const { socket } = useSocket();
  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on("event", (name, points) => {
      toast({ name, points });
    });

    return () => {
      socket?.off("event");
    };
  }, [socket, toast]);
  return (
    <ToastProvider duration={5000}>
      {toasts.map(function ({ id, name, points, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="mx-auto">
              <ToastDescription>{`+${points} ${name}`}</ToastDescription>
            </div>
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
