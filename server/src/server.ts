import * as dotenv from "dotenv";
dotenv.config();
import { Server } from "socket.io";
import { CountdownTimer } from "./timer";
import { StreamElementsClient } from "./streamelements-client";
import { tierOne, tierThree, tierTwo } from "./points";
import * as Progress from "./progress";
import {
  cachedGoal,
  cachedTotalProgess,
  cachedTimeElapsed,
  cachedTimeleft,
  clearCache,
} from "./cache";
export interface ServerToClientEvents {
  timeUpdate: (days: string, time: string, points: number) => void;
  timeElapsed: (time: string) => void;
  event: (username: string, points: number, sender?: string) => void;
  gift: (username: string, amount: number) => void;
  progress: (points: number, total: number) => void;
  goal: (goal: string) => void;
}

export interface ClientToServerEvents {
  start: () => void;
  stop: () => void;
  add: (tier?: "1" | "2" | "3" | "gift", amount?: number) => void;
  setGoal: (goal: string) => void;
  reset: () => void;
}

const port = Number(process.env.PORT) || 4000;
// Create a socket.io server
const io = new Server<ClientToServerEvents, ServerToClientEvents>(port, {
  cors: { origin: process.env.CLIENT_URL },
});

const cachedToNumber = (s: string | null | undefined) =>
  s === null || !s || s.trim() === "" ? undefined : Number(s);

const init = async () => {
  // Get cached values
  let timerInit = cachedToNumber(await cachedTimeleft()) ?? 6 * 60 * 1000;
  let timerElapsed = cachedToNumber(await cachedTimeElapsed()) ?? 0;
  let goalInit = (await cachedGoal()) ?? "";
  let progressInit = cachedToNumber(await cachedTotalProgess()) ?? 6;

  Progress.setPoints(progressInit);
  Progress.setGoal(goalInit);
  const timer = new CountdownTimer(timerInit, timerElapsed, io);
  timer.start();

  io.on("connection", (socket) => {
    console.log(`Socket ${socket.id} connected.`);
    const { days, time, points } = timer.getRemainingTime();
    // Send Timer and Progress Status
    socket.emit("timeUpdate", days, time, points);
    socket.emit("timeElapsed", timer.getTimeElapsed());
    socket.emit("progress", Progress.progress, Progress.total);
    socket.emit("goal", Progress.goal);
    socket.on("start", () => {
      if (!timer.isRunning) {
        timer.start();
      }
    });
    socket.on("add", (tier = "1", amount = 5) => {
      let p: number;
      switch (tier) {
        case "1":
          p = tierOne();
          break;
        case "2":
          p = tierTwo();
          break;
        case "3":
          p = tierThree();
          break;
        case "gift":
          let sender = "gifter";
          io.emit("gift", sender, amount);
          Array.from(Array(amount)).forEach((_) => {
            let a = tierOne();
            timer.addTime(60 * 1000 * a);
            io.emit("progress", Progress.update(a), Progress.total);
            io.emit("event", `IONCANNON`, a, sender);
          });
          break;
        default:
          p = tierOne();
      }
      if (tier !== "gift") {
        timer.addTime(60 * 1000 * p);
        io.emit("progress", Progress.update(p), Progress.total);
        io.emit("event", `IONCANNON`, p);
      }
    });
    socket.on("setGoal", (goal) => {
      Progress.setGoal(goal);
      io.emit("goal", Progress.goal);
    });
    socket.on("stop", () => {
      if (timer.isRunning) {
        timer.stop();
      }
    });
    socket.on("reset", async () => {
      if (timer.isRunning) {
        timer.stop();
      }
      await clearCache();
      Progress.setPoints(0);
      Progress.setGoal("");
      timer.reset();
      // send reset values
      const { days, time, points } = timer.getRemainingTime();
      io.emit("timeUpdate", days, time, points);
      io.emit("timeElapsed", timer.getTimeElapsed());
      io.emit("progress", Progress.progress, Progress.total);
      io.emit("goal", Progress.goal);
    });
    // Clean up the socket on disconnect
    socket.on("disconnect", () => {
      console.log(`Socket ${socket.id} disconnected.`);
    });
  });

  StreamElementsClient.on("event", (event) => {
    let points = 0;
    let sender: string | undefined;
    console.log(event);
    if (event.type === "communityGiftPurchase") {
      io.emit(
        "gift",
        event.data.displayName ?? event.data.username,
        event.data.amount
      );
    }
    if (event.type === "tip") {
      console.log(event);
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
      if (event.data.gifted) {
        sender = event.data.sender;
      }
    }
    if (event.type === "cheer") {
      points = (event.data.amount / 100) * 2;
    }
    if (points) {
      timer.addTime(60 * 1000 * points);
      io.emit("progress", Progress.update(points), Progress.total);
      io.emit(
        "event",
        event.data.displayName ?? event.data.username,
        points,
        sender
      );
    }
  });
};
init();
