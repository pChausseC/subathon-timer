"use client";
import { useState, useEffect, useMemo } from "react";
import { useSocket } from "@/providers/socket-provider";
import { Skeleton } from "./ui/skeleton";
export const TimeLeft = () => {
  const [time, setTime] = useState("");
  const [days, setDays] = useState("");
  const [glowing, setGlowing] = useState(false);
  const { socket } = useSocket();
  const loading = useMemo(() => time === "", [time]);
  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on("timeUpdate", (days, time) => {
      setDays(days);
      setTime(time);
    });
    socket.on("event", () => {
      setGlowing(true);
      setTimeout(() => {
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
        <Skeleton className="px-1 text-[47px] w-[2ch]">00</Skeleton>
      ) : (
        <div className="flex items-center bg-foreground px-1 text-[47px] text-background group-data-[glow=true]:bg-primary">
          <span className="w-[2ch] text-center">{days}</span>
        </div>
      )}
      {loading ? (
        <Skeleton className="w-[6.7ch]">00:00:00</Skeleton>
      ) : (
        <span className="w-[6.7ch]">{time}</span>
      )}
    </div>
  );
};
