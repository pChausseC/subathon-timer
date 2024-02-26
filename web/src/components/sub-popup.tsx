"use client";
import React, { useCallback } from "react";
import { Toast, ToastDescription } from "./ui/toast";
import { type ServerToClientEvents, useSocket } from "@/providers/socket-provider";

export const SubPopup = React.forwardRef<
  React.ElementRef<typeof Toast>,
  React.ComponentPropsWithoutRef<typeof Toast> & {
    name: string;
    initialPoints: number;
  }
>(({ name, initialPoints, ...props }, ref) => {
  const [points, setPoints] = React.useState(initialPoints);
  const [giftRecievers, setGiftRecievers] = React.useState<string[]>([]);
  const { socket } = useSocket();
  const eventHandler: ServerToClientEvents["event"] = useCallback(
    (reciever, points, sender) => {
      if (sender === name) {
        setPoints((p) => p + points);
        setGiftRecievers((a) => [...a, `+${points} ${reciever}`]);
      }
    },
    [name],
  );
  React.useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on("event", eventHandler);

    return () => {
      socket?.off("event", eventHandler);
    };
  }, [socket, eventHandler]);
  return (
    <Toast {...props} ref={ref} className="flex flex-col">
      <div className="mx-auto">
        <ToastDescription> {`+${points} ${name}`}</ToastDescription>
      </div>
    </Toast>
  );
});

SubPopup.displayName = "SubPopup";
