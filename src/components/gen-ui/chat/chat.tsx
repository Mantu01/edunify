import { roleColors } from '@/lib/constants';
import { ChatSidebar } from './chat-sidebar';
import { ChatInterface } from './chat-interface';
import { useAuth } from '@clerk/nextjs';
import { ChatProvider } from '@/contexts/chat-context';

const Chat: React.FC = () => {
  const {sessionClaims}=useAuth();

  const role = sessionClaims?.role as keyof typeof roleColors;

  return (
      <ChatProvider>
        <div className="h-160 flex flex-col font-['Inter'] antialiased">
          <div className="flex-1 flex overflow-hidden">
            <div className="hidden lg:flex w-1/4 flex-col border-r">
              <ChatSidebar
                role={role}
              />
            </div>
            <div className="flex-1 flex flex-col">
              <ChatInterface role={role} />
            </div>
          </div>
        </div>
      </ChatProvider>
  );
};

export default Chat;