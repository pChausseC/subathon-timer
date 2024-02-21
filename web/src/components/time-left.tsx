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
  return <div className="px-4 py-2 font-mono">Time: {time}</div>;
};
