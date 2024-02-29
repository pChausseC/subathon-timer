"use client";
import { useState, useEffect } from "react";
import { useSocket } from "@/providers/socket-provider";
import { Progress } from "./ui/progress";
function getNextMultipleOf250(x: number): number {
  return Math.ceil(x / 250) * 250;
}
export const ProgressBar = () => {
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const { socket } = useSocket();
  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on("progress", (progress, total) => {
      setProgress(progress);
      setTotal(total);
    });

    return () => {
      socket?.off("progress");
    };
  }, [socket]);
  return (
    <Progress value={progress}>
      <span className="font-wide relative bottom-[8px] px-1 text-xs font-[500] leading-none invert">
        {total}/{getNextMultipleOf250(total)}
      </span>
    </Progress>
  );
};
