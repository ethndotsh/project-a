import { useEffect, useState, useRef } from "react";
import {
  type EthanGPTMessage,
  ChatLine,
  LoadingChatLine,
} from "@/components/ChatLine";
import { TextInput, Button } from "@tremor/react";
import clsx from "clsx";

// default first message to display in UI (not necessary to define the prompt)
export const initialMessages: EthanGPTMessage[] = [
  {
    role: "assistant",
    content: "I am EthanGPT. Ask me anything.",
  },
];

const InputMessage = ({ input, setInput, sendMessage }: any) => (
  <div className="clear-both mx-6 flex">
    <TextInput
      placeholder="Type a message..."
      value={input}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          sendMessage(input);
          setInput("");
        }
      }}
      onChange={(e) => {
        setInput(e.target.value);
      }}
    />

    <Button
      className="ml-2"
      type="submit"
      color="orange"
      onClick={() => {
        sendMessage(input);
        setInput("");
      }}
    >
      ASK ETHANGPT
    </Button>
  </div>
);

export function Chat() {
  const [messages, setMessages] = useState<EthanGPTMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // send message to API /api/chat endpoint
  const sendMessage = async (message: string) => {
    setLoading(true);
    const newMessages = [
      ...messages,
      { role: "user", content: message } as EthanGPTMessage,
    ];
    setMessages(newMessages);
    const last10messages = newMessages.slice(-10); // remember last 10 messages

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: last10messages,
      }),
    });

    if (!response.ok) {
      alert("Error sending message");
      throw new Error(response.statusText);
    }

    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    let lastMessage = "";

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      lastMessage = lastMessage + chunkValue;

      setMessages([
        ...newMessages,
        { role: "assistant", content: lastMessage } as EthanGPTMessage,
      ]);

      dummy.current?.scrollIntoView({ behavior: "smooth" });

      setLoading(false);
    }
  };

  const dummy = useRef<HTMLDivElement>(null);

  return (
    <div className="lg:p-6">
      <h1 className="mb-2 text-4xl font-bold">EthanGPT</h1>
      <p className="mb-6">
        Please do not use too much, I have to pay for this.
      </p>
      <div className="pb-32">
        <div className={clsx("max-h-fit overflow-scroll p-0.5")}>
          {messages.map(({ content, role }, index) => (
            <ChatLine key={index} role={role} content={content} />
          ))}
        </div>
        {loading && <LoadingChatLine />}
      </div>
      <div ref={dummy} />

      <div className="fixed bottom-0 left-0 w-full border-t bg-white py-6">
        <InputMessage
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
}

export default Chat;
