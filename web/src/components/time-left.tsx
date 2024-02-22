"use client";
import { useState, useEffect, useMemo } from "react";
import { useSocket } from "@/providers/socket-provider";
import { Skeleton } from "./ui/skeleton";
export const TimeLeft = () => {
  const [glow, setGlow] = useState(0);
  const [time, setTime] = useState("");
  const [days, setDays] = useState("");
  const [glowing, setGlowing] = useState(false);
  const { socket } = useSocket();
  const loading = useMemo(() => time === "", [time]);
  useEffect(() => {
    if (!socket) {
      return;
    }
    let timeout: NodeJS.Timeout | undefined;
    socket.on("timeUpdate", (days, time) => {
      setGlow((g) => g - 0.1);
      setDays(days);
      setTime(time);
    });
    socket.on("event", (_, pts) => {
      clearTimeout(timeout);
      setGlow((g) => g + pts / 10);
      setGlowing(true);
      timeout = setTimeout(() => {
        setGlowing(false);
      }, 5000);
    });

    return () => {
      socket.off("timeUpdate");
      socket.off("event");
    };
  }, [socket]);

  return (
    <div
      className="group flex items-stretch gap-2 text-6xl font-bold transition-colors duration-500 data-[glow=true]:text-primary"
      data-glow={glowing}
    >
      {loading ? (
        <Skeleton className="w-[2ch] px-1 text-[47px]">00</Skeleton>
      ) : (
        <div className="flex items-center bg-foreground px-1 text-[47px] text-background group-data-[glow=true]:bg-primary">
          <span className="mb-[15px] w-[2ch] text-center leading-[30px]">
            {days}
          </span>
        </div>
      )}
      {loading ? (
        <Skeleton className="w-[6.7ch]">00:00:00</Skeleton>
      ) : (
        <span
          className="group-data-[glow=true]:animate-glow mb-[20px] w-[6.7ch] leading-[30px]"
          style={
            !glowing
              ? { textShadow: `0 1px 20px rgb(243 243 243/${glow / 100})` }
              : undefined
          }
        >
          {time}
        </span>
      )}
    </div>
  );
};
