"use client";

import { useSocket } from "@/providers/socket-provider";
import { type FormEventHandler, useEffect, useState } from "react";
import debounce from "lodash.debounce";

export const Goal = () => {
  const [goal, setGoal] = useState("");
  const { socket } = useSocket();
  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on("goal", (goal) => {
      setGoal(goal);
    });

    return () => {
      socket?.off("goal");
    };
  }, [socket]);

  const handleChange: FormEventHandler<HTMLSpanElement> = (e) => {
    debounceEmit(e.currentTarget.innerHTML);
  };
  const debounceEmit = debounce((value: string) => {
    socket?.emit("setGoal", value);
  }, 1000);

  // Effect to clean up the debounced emit
  useEffect(() => {
    return () => {
      debounceEmit.cancel();
    };
  }, []);

  return (
    <div className="absolute top-[calc(100%-20px)] min-h-[40px] min-w-[40%] max-w-[80%] rounded-lg bg-foreground px-5 py-1 text-center text-2xl font-bold uppercase text-background">
      <span
        contentEditable
        className="relative bottom-1"
        onInput={handleChange}
        dangerouslySetInnerHTML={{ __html: goal }}
      />
    </div>
  );
};
