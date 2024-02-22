"use client";
import { useSocket } from "@/providers/socket-provider";
import { Button } from "./ui/button";
import { PauseIcon, PlayIcon } from "@radix-ui/react-icons";

export const Controls = () => {
  const { socket } = useSocket();
  const start = () => {
    socket?.emit("start");
  };
  const stop = () => {
    socket?.emit("stop");
  };
  return (
    <div className="space-x-2">
      <Button onClick={start} size="icon" variant="outline">
        <PlayIcon />
      </Button>
      <Button onClick={stop} size="icon" variant="outline">
        <PauseIcon />
      </Button>
    </div>
  );
};
