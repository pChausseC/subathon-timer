"use client";
import React, { useCallback } from "react";
import { Toast, ToastDescription } from "./ui/toast";
import {
  type ServerToClientEvents,
  useSocket,
} from "@/providers/socket-provider";
import { AnimatePresence, motion } from "framer-motion";

export const SubPopup = React.forwardRef<
  React.ElementRef<typeof Toast>,
  React.ComponentPropsWithoutRef<typeof Toast> & {
    name: string;
    initialPoints: number;
  }
>(({ name, initialPoints, ...props }, ref) => {
  const [points, setPoints] = React.useState(initialPoints);
  const [giftReceivers, setGiftReceivers] = React.useState<string[]>([]);
  const { socket } = useSocket();
  const eventHandler: ServerToClientEvents["event"] = useCallback(
    (receiver, points, sender) => {
      if (sender === name) {
        setPoints((p) => p + points);
        setGiftReceivers((a) => [...a, `+${points} ${receiver}`]);
      }
    },
    [name],
  );
  React.useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on("event", eventHandler);

    return () => {
      socket?.off("event", eventHandler);
    };
  }, [socket, eventHandler]);
  return (
    <Toast {...props} ref={ref} className="flex flex-col overflow-visible">
      {giftReceivers.length ? <TextLoop texts={giftReceivers} /> : undefined}
      <ToastDescription className="mx-auto">
        {`+${points} ${name}`}
      </ToastDescription>
    </Toast>
  );
});

SubPopup.displayName = "SubPopup";

const variants = {
  enter: () => {
    return {
      y: "-100%",
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    y: 0,
    opacity: 1,
  },
  exit: () => {
    return {
      zIndex: 0,
      y: "100%",
      opacity: 0,
    };
  },
};
const TextLoop = ({ texts }: { texts: string[] }) => {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    setTimeout(
      () => {
        let next = index + 1;
        if (next === texts.length) {
          next = 0;
        }
        setIndex(next);
      },
      1000 / texts.length + 300,
    );
  }, [index, setIndex, texts.length]);
  return (
    <div className="absolute bottom-full mb-1 flex w-full items-center overflow-hidden rounded-lg border border-primary px-2 py-1 shadow-lg">
      <AnimatePresence mode="popLayout">
        <motion.div
          variants={variants}
          key={index}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            y: { type: "linear" },
            duration: 0.3,
          }}
          className="text-md relative mb-1 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-center leading-none text-primary"
        >
          {texts[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
