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
      {giftReceivers.length ? (
        <TextLoop texts={giftReceivers} />
      ) : undefined}
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
    <div className="absolute bottom-full mb-1 h-[40px] overflow-hidden rounded-lg border border-primary px-1 py-1">
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
          className="whitespace-nowrap text-primary"
        >
          {texts[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
