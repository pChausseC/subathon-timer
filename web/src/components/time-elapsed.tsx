"use client";
import { useState, useEffect, useMemo } from "react";
import { useSocket } from "@/providers/socket-provider";
import { TimerIcon } from "./icons/timer";
import { Skeleton } from "./ui/skeleton";
export const TimeElapsed = () => {
  const [time, setTime] = useState("");
  const loading = useMemo(() => time === "", [time]);
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
      {loading ? <Skeleton>00:00:00:00</Skeleton> : time}
      <hr className="flex-1 rounded-sm border-t-[0.1875rem] border-foreground" />
    </div>
  );
};
