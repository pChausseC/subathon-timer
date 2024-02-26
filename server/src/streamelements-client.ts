import { io, Socket } from "socket.io-client";
const token = process.env.STREAMELEMENTS_JWT;
const streamElementsWebSocketUrl = "https://realtime.streamelements.com";

interface StreamElementsEvent {
  _id: string;
  channel: string;
  type:
    | "cheer"
    | "follow"
    | "host"
    | "raid"
    | "subscriber"
    | "tip"
    | "communityGiftPurchase";
  provider: "twitch" | "youtube" | "facebook";
  flagged?: boolean;
  data: {
    tipId?: string;
    username: string;
    providerId?: string;
    displayName: string;
    amount: number;
    streak?: number;
    tier?: "1000" | "2000" | "3000" | "prime";
    currency?: string;
    message: string;
    quantity?: number;
    items: any[]; // Define a specific type for items if available
    avatar: string;
    sender?: string;
    gifted?: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

// Connect to StreamElements WebSocket API
const socket: Socket & {
  on(event: "event", listener: (data: StreamElementsEvent) => void): void;
} = io(streamElementsWebSocketUrl, {
  transports: ["websocket"],
});

// Socket connected
socket.on("connect", onConnect);
// Socket got disconnected
socket.on("disconnect", onDisconnect);
// Socket is authenticated
socket.on("authenticated", onAuthenticated);
socket.on("unauthorized", console.error);

function onConnect() {
  console.log("Successfully connected to StreamElements");
  socket.emit("authenticate", { method: "jwt", token });
}

function onDisconnect() {
  console.log("Disconnected from StreamElements");
  // Reconnect
}

function onAuthenticated(data: { channelId: string }) {
  const { channelId } = data;
  console.log(
    `Successfully authenticated to streamelements channel ${channelId}`
  );
}

export { socket as StreamElementsClient };
