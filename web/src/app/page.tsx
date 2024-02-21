import { ProgressBar } from "@/components/progress-bar";
import { SocketIndicator } from "@/components/socket-indicator";
import { TimeElapsed } from "@/components/time-elapsed";
import { TimeLeft } from "@/components/time-left";
import { Toaster } from "@/components/ui/toaster";
export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-stone-900 text-white">
      <div className="relative w-full">
        <Toaster />
      </div>
      <div className="z-10 flex flex-col items-center justify-center gap-2 rounded-xl border-white bg-black p-5">
        <SocketIndicator />
        <TimeLeft />
        <TimeElapsed />
        <ProgressBar />
      </div>
    </main>
  );
}
