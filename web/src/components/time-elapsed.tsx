"use client";
import { useState, useEffect } from "react";
import { useSocket } from "@/providers/socket-provider";
import { TimerIcon } from "./icons/timer";
export const TimeElapsed = () => {
  const [time, setTime] = useState("");
  const { socket } = useSocket();
  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on("timeElapsed", (time: string) => {
      setTime(time);
    });

    return () => {
      socket?.off("timeElapsed");
    };
  }, [socket]);
  return (
    <div className="flex w-full items-center gap-2 font-mono text-2xl">
      <hr className="flex-1 rounded-sm border-t-[0.1875rem] border-foreground" />
      <TimerIcon />
      {time}
      <hr className="flex-1 rounded-sm border-t-[0.1875rem] border-foreground" />
    </div>
  );
};
