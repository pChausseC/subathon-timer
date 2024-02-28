"use client";
import { useSocket } from "@/providers/socket-provider";
import { Button } from "./ui/button";
import { PauseIcon, PlayIcon, ResetIcon } from "@radix-ui/react-icons";
import { AddPoints } from "./add-points";

export const Controls = () => {
  const { socket } = useSocket();
  const start = () => {
    socket?.emit("start");
  };
  const stop = () => {
    socket?.emit("stop");
  };

  const reset = () => {
    socket?.emit("reset");
  };
  return (
    <div className="space-x-2">
      <Button onClick={start} size="icon" variant="outline" title="start">
        <PlayIcon />
      </Button>
      <Button onClick={stop} size="icon" variant="outline" title="pause">
        <PauseIcon />
      </Button>
      <AddPoints />
      <Button onClick={reset} size="icon" variant="outline" title="reset">
        <ResetIcon />
      </Button>
    </div>
  );
};
