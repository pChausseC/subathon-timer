"use client";
import { SocketIndicator } from "@/components/socket-indicator";
import { useSocket } from "@/providers/socket-provider";
import { useState, useEffect } from "react";

const Chat = () => {
  // State to store the messages
  const [messages, setMessages] = useState<string[]>([]);
  // State to store the current message
  const [currentMessage, setCurrentMessage] = useState("");
  const [time, setTime] = useState("");
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) {
      return;
    }
    // Listen for incoming messages
    socket.on("message", (message: string) => {
      console.log(message);

      setMessages((prevMessages) => [...prevMessages, message]);
    });
    socket.on("timeUpdate", (time: string) => {
      setTime(time);
    });

    return () => {
      socket?.off("message");
      socket?.off("timeUpdate");
    };
  }, [socket]);

  const sendMessage = async () => {
    // Send the message to the server
    socket?.emit("message", currentMessage);
    // Clear the currentMessage state
    setCurrentMessage("");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-white">
      <div className="flex items-center">
        <SocketIndicator /> {time}
      </div>
      {/* Display the messages */}
      {messages.map((message, index) => (
        <p key={index}>{message}</p>
      ))}

      {/* Input field for sending new messages */}
      <input
        type="text"
        className="text-black"
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
      />

      {/* Button to submit the new message */}
      <button onClick={sendMessage}>Send</button>
    </main>
  );
};

export default Chat;
