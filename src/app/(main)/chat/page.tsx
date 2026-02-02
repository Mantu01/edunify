import { MessageThreadFull } from "@/components/ui/message-thread-full";

export default function ChatPage() {
  return (
    <div className="scale-y-95 h-175 pb-10">
      <MessageThreadFull contextKey="main-chat" />
    </div>
  );
}