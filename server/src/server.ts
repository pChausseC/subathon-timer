import { EventsMap } from "@socket.io/component-emitter";
import { Server } from "socket.io";
import { CountdownTimer } from "./timer";

interface ServerToClientEvents {
  message: (m: string) => void;
}

interface ClientToServerEvents {
  message: (m: string) => void;
}

interface SocketData {
  name: string;
  age: number;
}

// Create a socket.io server
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  EventsMap,
  SocketData
>(4000, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log(`Socket ${socket.id} connected.`);

  // Listen for incoming messages and broadcast to all clients
  socket.on("message", (message) => {
    console.log(message);
    io.emit("message", message);
  });

  // Clean up the socket on disconnect
  socket.on("disconnect", () => {
    console.log(`Socket ${socket.id} disconnected.`);
  });
});

// Example usage
const timer = new CountdownTimer(30 * 60 * 1000, io);

// Start the timer
timer.start();

// Example of adding time after 5 minutes
setTimeout(() => {
  timer.addTime(5 * 60 * 1000); // Add 5 minutes
}, 5 * 1000);
