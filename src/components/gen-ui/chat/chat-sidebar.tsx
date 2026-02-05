import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Clock, FileText, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { roleColors } from '@/lib/constants';
import { useChat } from '@/contexts/chat-context';

interface ChatSidebarProps {
  role: keyof typeof roleColors;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ role }) => {
  const colors = roleColors[role];
  const { recentChats, selectChat, newChat } = useChat();

  return (
    <div className={cn('h-160 flex flex-col border-r', colors.border, colors.darkBorder)}>
      <div className="p-6">
        <Button
          className={cn('w-full font-medium text-white transition-all duration-300', colors.button)}
          onClick={newChat}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>
      
      <div className="px-6 pb-4">
        <div className="flex items-center mb-3">
          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
          <h3 className="text-sm font-medium text-muted-foreground">Recent Conversations</h3>
        </div>
      </div>

      <ScrollArea className="flex-1 px-6 pb-6">
        <div className="space-y-3">
          {recentChats.map((chat) => (
            <Card
              key={chat.id}
              className={cn(
                'p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02]',
                colors.bg,
                colors.darkBg,
                'border shadow-sm'
              )}
              onClick={() => selectChat(String(chat.id))}
            >
              <div className="flex items-start">
                <FileText className={cn('h-4 w-4 mt-0.5 mr-3', colors.text)} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{chat.header}</p>
                  <div className="flex items-center mt-1">
                    <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {chat.updatedAt
                        ? new Date(chat.updatedAt).toLocaleDateString()
                        : ''}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};