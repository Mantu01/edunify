import { RoomPage } from "@/components/room/main";
import { MessageThreadCollapsible } from "@/components/ui/message-thread-collapsible";

export default function PageWithChat() {
  return (
    <div className="relative min-h-175">
      <RoomPage/>
      <MessageThreadCollapsible
        defaultOpen={false}
        className="fixed slide-out-to-bottom-1/2 right-4 bg-linear-to-b shadow-2xl shadow-black from-yellow-50/20 via-yellow-50 to-orange-50/20 border-black"
      />
    </div>
  );
}