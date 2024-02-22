"use client";
import { useState, useEffect } from "react";
import { useSocket } from "@/providers/socket-provider";
export const TimeLeft = () => {
  const [time, setTime] = useState("");
  const { socket } = useSocket();
  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on("timeUpdate", (time: string) => {
      setTime(time);
    });

    return () => {
      socket?.off("timeUpdate");
    };
  }, [socket]);
  return <div className="font-mono text-6xl">{time}</div>;
};
