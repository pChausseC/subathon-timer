"use client";
import React, { useCallback, useMemo } from "react";
import { Toast, ToastDescription } from "./ui/toast";
import {
  type ServerToClientEvents,
  useSocket,
} from "@/providers/socket-provider";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";

const subPopupVariants = cva("flex flex-col overflow-visible", {
  variants: {
    variant: {
      default: "",
      gradient: "bg-gradient-to-tr from-indigo-700 to-pink-700",
      rainbow: "bg-gradient-to-tr from-red-500 via-green-600 to-violet-600",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const SubPopup = React.forwardRef<
  React.ElementRef<typeof Toast>,
  React.ComponentPropsWithoutRef<typeof Toast> & {
    name: string;
    initialPoints: number;
    amount?: number;
  }
>(({ name, initialPoints, amount = 1, ...props }, ref) => {
  const [points, setPoints] = React.useState(initialPoints);
  const [giftReceivers, setGiftReceivers] = React.useState<string[]>([]);
  const { socket } = useSocket();

  const variant = useMemo(() => {
    if (amount >= 100) return "rainbow";
    if (amount >= 50) return "gradient";
    return "default";
  }, [amount]);

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
    <Toast {...props} ref={ref} className={cn(subPopupVariants({ variant }))}>
      {giftReceivers.length ? (
        <TextLoop texts={giftReceivers} variant={variant} />
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

const popupVariants = cva(
  "group absolute bottom-full mb-1 w-full overflow-hidden rounded-lg shadow-lg border",
  {
    variants: {
      variant: {
        default: "border-primary",
        gradient:
          "border-transparent bg-gradient-to-tr from-indigo-700 to-pink-700",
        rainbow:
          "border-transparent bg-gradient-to-tr from-red-500 via-green-600 to-violet-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);
const textVariants = cva(
  "text-md relative mb-1 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-center leading-none ",
  {
    variants: {
      variant: {
        default: "text-primary",
        gradient:
          "bg-gradient-to-tr from-indigo-700 to-pink-700 bg-clip-text text-transparent",
        rainbow:
          "bg-gradient-to-tr from-red-500 via-green-600 to-violet-600 bg-clip-text text-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);
const TextLoop = ({
  texts,
  variant,
}: { texts: string[] } & VariantProps<typeof popupVariants>) => {
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
    <div className={cn(popupVariants({ variant }))}>
      <div className="flex w-full items-center rounded-md bg-white px-2 py-1">
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
            className={cn(textVariants({ variant }))}
          >
            {texts[index]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
