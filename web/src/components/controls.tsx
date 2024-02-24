"use client";
import { useSocket } from "@/providers/socket-provider";
import { Button } from "./ui/button";
import { PauseIcon, PlayIcon, PlusIcon } from "@radix-ui/react-icons";

export const Controls = () => {
  const { socket } = useSocket();
  const start = () => {
    socket?.emit("start");
  };
  const stop = () => {
    socket?.emit("stop");
  };
  const test = () => {
    socket?.emit("test");
  };
  return (
    <div className="space-x-2">
      <Button onClick={start} size="icon" variant="outline">
        <PlayIcon />
      </Button>
      <Button onClick={stop} size="icon" variant="outline">
        <PauseIcon />
      </Button>
      <Button onClick={test} size="icon" variant="outline" title="test">
        <PlusIcon />
      </Button>
    </div>
  );
};
