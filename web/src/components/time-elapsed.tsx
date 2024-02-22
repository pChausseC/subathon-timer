"use client";
import { useState, useEffect } from "react";
import { useSocket } from "@/providers/socket-provider";
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
  return <div className="font-mono text-2xl">{time}</div>;
};
