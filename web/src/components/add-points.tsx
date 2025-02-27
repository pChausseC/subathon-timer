"use client";
import { PlusIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useSocket } from "@/providers/socket-provider";

export const AddPoints = () => {
  const { socket } = useSocket();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline" title="Add Points">
          <PlusIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="font-inter">
        <DropdownMenuLabel>Add Points</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            socket?.emit("add", "1");
          }}
          className="cursor-pointer"
        >
          Tier 1 (4-7)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            socket?.emit("add", "2");
          }}
          className="cursor-pointer"
        >
          Tier 2 (9-12)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            socket?.emit("add", "3");
          }}
          className="cursor-pointer"
        >
          Tier 3 (25-28)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            socket?.emit("add", "gift");
          }}
          className="cursor-pointer"
        >
          Gift X 5
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            socket?.emit("add", "gift", 50);
          }}
          className="cursor-pointer"
        >
          Gift X 50
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            socket?.emit("add", "gift", 100);
          }}
          className="cursor-pointer"
        >
          Gift X 100
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            socket?.emit("add", "dono", 250);
          }}
          className="cursor-pointer"
        >
          dono 250$
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
