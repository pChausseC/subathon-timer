import { SocketIndicator } from "@/components/socket-indicator";
import { TimeElapsed } from "@/components/time-elapsed";
import { TimeLeft } from "@/components/time-left";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-white">
      <SocketIndicator />
      <TimeLeft />
      <TimeElapsed />
    </main>
  );
}
