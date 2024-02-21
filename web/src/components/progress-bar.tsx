"use client";
import { useState, useEffect } from "react";
import { useSocket } from "@/providers/socket-provider";
import { Progress } from "./ui/progress";
export const ProgressBar = () => {
  const [progress, setProgress] = useState(0);
  const { socket } = useSocket();
  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on("progress", (progress) => {
      setProgress(progress);
    });

    return () => {
      socket?.off("progress");
    };
  }, [socket]);
  return <Progress value={progress} />;
};
