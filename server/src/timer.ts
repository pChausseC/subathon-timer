import { Server as SocketServer } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "./server";
import { cacheTimeElapsed, cacheTimeleft } from "./cache";
import { ONE_DAY, ONE_HOUR, ONE_MIN, ONE_SECOND, timeToPoints } from "./utils";

export class CountdownTimer {
  private _remainingTime: number;
  private timerId: NodeJS.Timeout | null;
  private io: SocketServer<ClientToServerEvents, ServerToClientEvents>;
  private isRunning_: boolean;
  constructor(
    private initialTime: number = 30 * ONE_MIN,
    private _timeElapsed: number = 0,
    io: SocketServer<ClientToServerEvents, ServerToClientEvents>
  ) {
    this._remainingTime = initialTime;
    this.timerId = null;
    this.io = io;
  }

  start() {
    this.isRunning_ = true;
    this.timerId = setInterval(() => {
      if (this._remainingTime <= 0) {
        this.stop();
      } else {
        this._remainingTime -= ONE_SECOND; // Subtract one second
        this._timeElapsed += ONE_SECOND;
        const formattedTime = this.formatTime(this._remainingTime, {
          splitDays: true,
        });
        const formattedElapsedTime = this.formatTime(this._timeElapsed);
        cacheTimeleft(this._remainingTime);
        cacheTimeElapsed(this._timeElapsed);
        this.io.emit(
          "timeUpdate",
          formattedTime.days,
          formattedTime.time,
          timeToPoints(this._remainingTime)
        );
        this.io.emit("timeElapsed", formattedElapsedTime);
      }
    }, ONE_SECOND);
  }

  stop() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
      this.isRunning_ = false;
    }
  }
  reset() {
    this.stop();
    this._remainingTime = 0;
    this._timeElapsed = 0;
  }
  get isRunning() {
    return this.isRunning_;
  }
  get remainingTime(): { days: string; time: string; points: number } {
    return {
      ...this.formatTime(this._remainingTime, {
        splitDays: true,
      }),
      points: timeToPoints(this._remainingTime),
    };
  }
  public set remainingTime(t: number) {
    this._remainingTime = t;
  }
  get timeElapsed() {
    return this.formatTime(this._timeElapsed);
  }
  setTimeElapsed(t: number) {
    this._timeElapsed = t;
  }
  get totalTimeInPoints() {
    return Math.floor(timeToPoints(this._remainingTime + this._timeElapsed));
  }
  addTime(extraTime: number) {
    this._remainingTime += extraTime;
    console.log(
      `Added ${timeToPoints(
        extraTime
      )} minutes. New remaining time: ${timeToPoints(
        this._remainingTime
      )} minutes.`
    );
    const formattedTime = this.formatTime(this._remainingTime, {
      splitDays: true,
    });
    this.io.emit(
      "timeUpdate",
      formattedTime.days,
      formattedTime.time,
      timeToPoints(this._remainingTime)
    );
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
    const days = Math.floor(milliseconds / ONE_DAY);
    const hours = Math.floor((milliseconds % ONE_DAY) / ONE_HOUR);
    const minutes = Math.floor((milliseconds % ONE_HOUR) / ONE_MIN);
    const seconds = Math.floor((milliseconds % ONE_MIN) / ONE_SECOND);
    const time = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    if (opts?.splitDays) {
      return { days: days.toString().padStart(2, "0"), time };
    }
    return `${days.toString().padStart(2, "0")}:${time}`;
  }
}
