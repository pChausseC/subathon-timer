import { Goal } from "@/components/goal";
import { ProgressBar } from "@/components/progress-bar";
import { SocketIndicator } from "@/components/socket-indicator";
import { TimeElapsed } from "@/components/time-elapsed";
import { TimeLeft } from "@/components/time-left";
import { Toaster } from "@/components/ui/toaster";
export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="relative w-full">
        <Toaster />
      </div>
      <div className="z-10 flex flex-col items-center justify-center gap-2 rounded-[10px] border-2 border-white bg-black px-5 pb-8 pt-4 relative">
        <SocketIndicator />
        <TimeLeft />
        <TimeElapsed />
        <ProgressBar />
        <Goal />
      </div>
    </main>
  );
}
