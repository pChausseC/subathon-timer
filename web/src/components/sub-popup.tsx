"use client";
import React from "react";
import { Toast, ToastDescription } from "./ui/toast";
import { useSocket } from "@/providers/socket-provider";

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
  React.useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on("event", (reciever, points, sender) => {
      if (sender === name) {
        console.log(`+${points} ${reciever}`);
        setPoints((p) => p + points);
        setGiftRecievers((a) => [...a, `+${points} ${reciever}`]);
      }
    });

    return () => {
      socket?.off("event");
    };
  }, [socket, name]);
  return (
    <Toast {...props} ref={ref} className="flex flex-col">
      <div className="mx-auto">
        <ToastDescription> {`+${points} ${name}`}</ToastDescription>
      </div>
    </Toast>
  );
});

SubPopup.displayName = "SubPopup";
