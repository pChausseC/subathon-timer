import "@/styles/globals.css";

import { TRPCReactProvider } from "@/trpc/react";
import { SocketProvider } from "@/providers/socket-provider";

export const metadata = {
  title: "Subathon Timer",
  description:
    "Step into the digital realm where we put a new spin on Flavor Flav's essence. Experience time infused with his iconic style. Welcome to our innovative homage to modern-day Flavor Flav.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/yjt5qpq.css" />
      </head>
      <body className={`font-sans`}>
        <TRPCReactProvider>
          <SocketProvider>{children}</SocketProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
