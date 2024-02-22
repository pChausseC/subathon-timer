"use client";
import { useState, useEffect } from "react";
import { useSocket } from "@/providers/socket-provider";
export const TimeLeft = () => {
  const [time, setTime] = useState("");
  const [days, setDays] = useState("");
  const [glowing, setGlowing] = useState(false);
  const { socket } = useSocket();
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
      className="font-mono text-6xl transition-colors duration-500 data-[glow=true]:text-primary flex items-stretch gap-2 leading-[3rem] group"
      data-glow={glowing}
    >
      <div className="bg-foreground text-background group-data-[glow=true]:bg-primary text-[47px] flex items-center px-1">{days}</div>{time}
    </div>
  );
};
