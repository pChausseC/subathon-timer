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
    <div className="flex w-full items-center gap-2 text-2xl font-bold">
      <hr className="flex-1 rounded-sm border-t-[0.1875rem] border-foreground" />
      <TimerIcon />
      {loading ? (
        <Skeleton className="w-[9ch] ">00:00:00:00</Skeleton>
      ) : (
        <span className="mb-[5px] w-[9ch] leading-[16px]">{time}</span>
      )}
      <hr className="flex-1 rounded-sm border-t-[0.1875rem] border-foreground" />
    </div>
  );
};
