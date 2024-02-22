import { Controls } from "@/components/controls";
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
      <div className="relative z-10 flex flex-col items-center justify-center gap-2 rounded-[10px] border-2 border-white bg-black px-5 pb-8 pt-4">
        <TimeLeft />
        <TimeElapsed />
        <ProgressBar />
        <Goal />
      </div>
      <div className="fixed bottom-5 left-1/2 -translate-x-[50%] text-center space-y-2">
        <Controls />
        <SocketIndicator />
      </div>
    </main>
  );
}
