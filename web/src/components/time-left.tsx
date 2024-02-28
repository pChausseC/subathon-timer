"use client";
import { useState, useEffect, useMemo } from "react";
import { useSocket } from "@/providers/socket-provider";
import { Skeleton } from "./ui/skeleton";
export const TimeLeft = () => {
  const [glow, setGlow] = useState(0);
  const [time, setTime] = useState("");
  const [days, setDays] = useState("");
  const [stage, setStage] = useState<0 | 1 | 2 | 3 | 4>(4);
  const [glowing, setGlowing] = useState(false);
  const { socket } = useSocket();
  const loading = useMemo(() => time === "", [time]);
  useEffect(() => {
    if (!socket) {
      return;
    }
    let timeout: NodeJS.Timeout | undefined;
    socket.on("timeUpdate", (days, time, points) => {
      setGlow((g) => {
        if (g <= 0) return 0;
        if (g > 10_000) return 5_000;
        if (g > 2000) return g - 10;
        if (g > 500) return g - 4;
        return g - 1;
      });
      setDays(days);
      setTime(time);
      if (points > 60) setStage(4);
      else if (points > 10) setStage(3);
      else if (points > 1) setStage(2);
      else if (points > 0) setStage(1);
      else setStage(0);
    });
    socket.on("event", (_, pts) => {
      clearTimeout(timeout);
      setGlow((g) => g + pts * 10);
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
      className="group flex items-stretch gap-2 text-6xl font-bold transition-colors duration-500 data-[glow=true]:!text-primary data-[stage='0']:text-red-600 data-[stage='1']:text-red-600 data-[stage='2']:text-red-600 data-[stage='3']:text-yellow-400"
      data-glow={glowing}
      data-stage={stage}
    >
      {loading ? (
        <Skeleton className="w-[2ch] px-1 text-[47px]">00</Skeleton>
      ) : (
        <div className="flex items-center bg-foreground px-1 text-[47px] text-background group-data-[glow=true]:!bg-primary group-data-[stage='0']:bg-red-600 group-data-[stage='1']:bg-red-600 group-data-[stage='2']:bg-red-600 group-data-[stage='3']:bg-yellow-400">
          <span className="mb-[15px] w-[2ch] text-center leading-[30px]">
            {days}
          </span>
        </div>
      )}
      {loading ? (
        <Skeleton className="w-[7.1ch]">00:00:00</Skeleton>
      ) : (
        <span
          className="group-data-[stage='1']:animate-pump mb-[18px] w-[7.1ch] leading-[30px] tracking-wide group-data-[glow=true]:animate-glow"
          style={
            !glowing
              ? { textShadow: `0 1px 20px rgb(243 243 243/${glow / 1_000})` }
              : undefined
          }
        >
          {time}
        </span>
      )}
    </div>
  );
};
