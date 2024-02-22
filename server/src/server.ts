import * as dotenv from "dotenv";
dotenv.config();
import { Server } from "socket.io";
import { CountdownTimer } from "./timer";
import { StreamElementsClient } from "./streamelements-client";
import { tierOne, tierThree, tierTwo } from "./points";
import * as Progress from "./progress";
export interface ServerToClientEvents {
  timeUpdate: (days: string, time: string) => void;
  timeElapsed: (time: string) => void;
  event: (username: string, points: number) => void;
  progress: (points: number) => void;
}

export interface ClientToServerEvents {}

const port = Number(process.env.PORT) || 4000;
// Create a socket.io server
const io = new Server<ClientToServerEvents, ServerToClientEvents>(port, {
  cors: { origin: process.env.CLIENT_URL },
});

io.on("connection", (socket) => {
  console.log(`Socket ${socket.id} connected.`);

  // Clean up the socket on disconnect
  socket.on("disconnect", () => {
    console.log(`Socket ${socket.id} disconnected.`);
  });
});

// Example usage
const timer = new CountdownTimer(20 * 60 * 1000, io);

// Start the timer
timer.start();

StreamElementsClient.on("event", (event) => {
  let points = 0;
  if (event.type === "tip") {
    //TODO Test
    points = event.data.amount * 2;
  }
  if (event.type === "subscriber") {
    switch (event.data.tier) {
      case "prime":
      case "1000":
        points = tierOne();
        break;
      case "2000":
        points = tierTwo();
        break;
      case "3000":
        points = tierThree();
        break;
    }
  }
  if (event.type === "cheer") {
    //TODO Test
    points = (event.data.amount / 100) * 2;
  }
  if (points) {
    timer.addTime(60 * 1000 * points);
    io.emit("progress", Progress.update(points));
    io.emit("event", event.data.displayName, points);
  }
});

setInterval(() => {
  io.emit("event", "IONCANNON", 40);
  io.emit("progress", Progress.update(40));
}, 10000);
