import clsx from "clsx";
import Balancer from "react-wrap-balancer";
import { Card } from "@tremor/react";

const BalancerWrapper = (props: any) => <Balancer {...props} />;

type EthanGPTAgent = "user" | "system" | "assistant";

export interface EthanGPTMessage {
  role: EthanGPTAgent;
  content: string;
}

// loading placeholder animation for the chat line
export const LoadingChatLine = () => (
  <Card className="max-w-xl">
    <div className="flex animate-pulse">
      <div className="flex flex-grow space-x-3">
        <div className="min-w-0 flex-1">
          <p className="font-large text-xxl text-gray-900">
            <a href="#" className="hover:underline">
              EthanGPT
            </a>
          </p>
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 h-2 rounded bg-zinc-500"></div>
              <div className="col-span-1 h-2 rounded bg-zinc-500"></div>
            </div>
            <div className="h-2 rounded bg-zinc-500"></div>
          </div>
        </div>
      </div>
    </div>
  </Card>
);

// util helper to convert new lines to <br /> tags
const convertNewLines = (text: string) =>
  text.split("\n").map((line, i) => (
    <span key={i}>
      {line}
      <br />
    </span>
  ));

export function ChatLine({ role = "assistant", content }: EthanGPTMessage) {
  if (!content) {
    return null;
  }
  const formattedMessage = convertNewLines(content);

  return (
    <div
      className={clsx(
        role != "assistant"
          ? "float-right clear-both"
          : "float-left clear-both",
        "mb-6"
      )}
    >
      <Card className="max-w-xl">
        <BalancerWrapper>
          <div className="float-right">
            <div className="flex space-x-3">
              <div className="flex-1 gap-4">
                <p className="font-large text-gray-900">
                  <a href="#" className="hover:underline">
                    {role == "assistant" ? "EthanGPT" : "You"}
                  </a>
                </p>
                <p className={"font-semibold"}>{formattedMessage}</p>
              </div>
            </div>
          </div>
        </BalancerWrapper>
      </Card>
    </div>
  );
}
