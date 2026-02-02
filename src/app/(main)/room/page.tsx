import { RoomPage } from "@/components/room/main";
import { MessageThreadCollapsible } from "@/components/ui/message-thread-collapsible";

export default function PageWithChat() {
  return (
    <div className="relative min-h-175 p-5">
      <RoomPage/>
      <MessageThreadCollapsible
        defaultOpen={false}
        className="fixed slide-out-to-bottom-1/2 right-4 bg-linear-to-b from-yellow-50/20 via-white to-orange-50/20 border-black"
      />
    </div>
  );
}