import * as dotenv from "dotenv";
dotenv.config();
import { EventsMap } from "@socket.io/component-emitter";
import { Server } from "socket.io";
import { CountdownTimer } from "./timer";
import { StreamElementsClient } from "./streamelements-client";
import { tierOne, tierThree, tierTwo } from "./points";

interface ServerToClientEvents {}

interface ClientToServerEvents {}

interface SocketData {
  name: string;
  age: number;
}
const port = Number(process.env.PORT) || 4000;
// Create a socket.io server
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  EventsMap,
  SocketData
>(port, { cors: { origin: process.env.CLIENT_URL, credentials: true } });

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
  console.log({ event });

  if (event.type === "tip") {
    //TODO Test
    let points = event.data.amount * 2;
    timer.addTime(60 * 1000 * points);
  }
  if (event.type === "communityGiftPurchase") {
    // maybe dont do anything here?
  }
  if (event.type === "subscriber") {
    switch (event.data.tier) {
      case "prime":
      case "1000":
        timer.addTime(60 * 1000 * tierOne());
        break;
      case "2000":
        timer.addTime(60 * 1000 * tierTwo());
        break;
      case "3000":
        timer.addTime(60 * 1000 * tierThree());
        break;
    }
  }
  if (event.type === "cheer") {
    //TODO Test
    let points = (event.data.amount / 100) * 2;
    timer.addTime(60 * 1000 * points);
  }
});
