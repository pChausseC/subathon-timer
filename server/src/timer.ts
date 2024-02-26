import { Server as SocketServer } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "./server";

export class CountdownTimer {
  private remainingTime: number;
  private timeElapsed: number;
  private timerId: NodeJS.Timeout | null;
  private io: SocketServer<ClientToServerEvents, ServerToClientEvents>;
  private isRunning_: boolean;

  constructor(
    private initialTime: number = 30 * 60 * 1000,
    io: SocketServer<ClientToServerEvents, ServerToClientEvents>
  ) {
    this.remainingTime = initialTime;
    this.timeElapsed = 0;
    this.timerId = null;
    this.io = io;
  }

  start() {
    this.isRunning_ = true;
    this.timerId = setInterval(() => {
      if (this.remainingTime <= 0) {
        this.stop();
      } else {
        this.remainingTime -= 1000; // Subtract one second
        this.timeElapsed += 1000;
        const formattedTime = this.formatTime(this.remainingTime, {
          splitDays: true,
        });
        const formattedElapsedTime = this.formatTime(this.timeElapsed);
        this.io.emit(
          "timeUpdate",
          formattedTime.days,
          formattedTime.time,
          this.remainingTime / (60 * 1000)
        );
        this.io.emit("timeElapsed", formattedElapsedTime);
      }
    }, 1000);
  }

  stop() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
      this.isRunning_ = false;
    }
  }
  get isRunning() {
    return this.isRunning_;
  }
  addTime(extraTime: number) {
    if (this.remainingTime === 0) {
      //cannot add more time when time is up
      return;
    }
    this.remainingTime += extraTime;
    console.log(
      `Added ${extraTime / (60 * 1000)} minutes. New remaining time: ${
        this.remainingTime / (60 * 1000)
      } minutes.`
    );
    const formattedTime = this.formatTime(this.remainingTime, {
      splitDays: true,
    });
    this.io.emit(
      "timeUpdate",
      formattedTime.days,
      formattedTime.time,
      this.remainingTime / (60 * 1000)
    );
  }

  getRemainingTime(): { days: string; time: string; points: number } {
    return {
      ...this.formatTime(this.remainingTime, {
        splitDays: true,
      }),
      points: this.remainingTime / (60 * 1000),
    };
  }
  getTimeElapsed(): string {
    return this.formatTime(this.timeElapsed);
  }
  private formatTime(
    milliseconds: number,
    opts: { splitDays: true }
  ): { days: string; time: string };
  private formatTime(
    milliseconds: number,
    opts?: { splitDays?: false }
  ): string;
  private formatTime(
    milliseconds: number,
    opts?: { splitDays?: boolean }
  ): string | { days: string; time: string } {
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    const time = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    if (opts?.splitDays) {
      return { days: days.toString().padStart(2, "0"), time };
    }
    return `${days.toString().padStart(2, "0")}:${time}`;
  }
}
