import { Controls } from "@/components/controls";
import { Goal } from "@/components/goal";
import { ProgressBar } from "@/components/progress-bar";
import { SocketIndicator } from "@/components/socket-indicator";
import { TimeElapsed } from "@/components/time-elapsed";
import { TimeLeft } from "@/components/time-left";
import { Toaster } from "@/components/ui/toaster";
import { VideoBackground } from "@/components/video-background";
export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="relative w-full">
        <Toaster />
      </div>
      <div className="relative z-10 rounded-[10px] border-2 border-white bg-transparent dark text-foreground ">
        <VideoBackground />
        <div className="relative flex flex-col items-center justify-center gap-2 px-5 pb-8 pt-4">
          <TimeLeft />
          <TimeElapsed />
          <ProgressBar />
          <Goal />
        </div>
      </div>
      <div className="fixed bottom-5 left-1/2 -translate-x-[50%] space-y-2 text-center font-inter">
        <Controls />
        <SocketIndicator />
      </div>
    </main>
  );
}
