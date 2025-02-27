"use client";
import { useSocket } from "@/providers/socket-provider";
import React from "react";
import { Badge } from "./ui/badge";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();
  if (!isConnected) {
    return (
      <Badge variant="outline" className="border-none bg-yellow-600 ">
        Fallback: Polling every 1s
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="border-none bg-emerald-600 text-primary-foreground">
     Live: Real-time updates
    </Badge>
  );
};
