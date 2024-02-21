import { Server as SocketServer, Socket } from "socket.io";

export class CountdownTimer {
  private remainingTime: number;
  private timeElapsed: number;
  private timerId: NodeJS.Timeout | null;
  private io: SocketServer;

  constructor(private initialTime: number = 30 * 60 * 1000, io: SocketServer) {
    this.remainingTime = initialTime;
    this.timeElapsed = 0;
    this.timerId = null;
    this.io = io;
  }

  start() {
    this.timerId = setInterval(() => {
      if (this.remainingTime <= 0) {
        this.stop();
      } else {
        this.remainingTime -= 1000; // Subtract one second
        this.timeElapsed += 1000;
        const formattedTime = this.formatTime(this.remainingTime);
        const formattedElapsedTime = this.formatTime(this.timeElapsed);
        this.io.emit("timeUpdate", formattedTime);
        this.io.emit('timeElapsed', formattedElapsedTime);
      }
    }, 1000);
  }

  stop() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  addTime(extraTime: number) {
    this.remainingTime += extraTime;
    console.log(
      `Added ${extraTime / (60 * 1000)} minutes. New remaining time: ${
        this.remainingTime / (60 * 1000)
      } minutes.`
    );
    const formattedTime = this.formatTime(this.remainingTime);
    this.io.emit("timeUpdate", formattedTime);
  }

  getRemainingTime(): number {
    return this.remainingTime;
  }
  private formatTime(milliseconds: number): string {
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

    return `${days.toString().padStart(2, "0")}:${hours
      .toString()
      .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
}
