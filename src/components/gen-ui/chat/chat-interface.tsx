import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, Send, User, Sparkles, BookOpen, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { roleColors } from '@/lib/constants';
import { useChat } from '@/contexts/chat-context';
import MarkdownPreview from '@/components/ui/custome-markdown-preview';

const KNOWLEDGE_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const TOPIC_CATEGORIES = ['Science', 'Technology', 'History', 'Mathematics', 'Arts', 'Business', 'Philosophy'];

interface ChatInterfaceProps {
  role: keyof typeof roleColors;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ role }) => {
  const {isChatStarted,messages,inputMessage,formData,setInputMessage,updateFormData,startChat,sendMessage,isSending} = useChat();

  const colors = roleColors[role];
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length,isSending]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col min-h-0">
      <ScrollArea className="flex-1 min-h-0 ">
        <div className="p-4 md:p-6">
          {!isChatStarted ? (
            <div className="max-w-2xl mx-auto">
              <Card className={cn('p-6 md:p-8 border-2', colors.border, colors.darkBorder)}>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full mb-3 bg-background border-2 border-primary/20">
                    <Sparkles className={cn('h-6 w-6 md:h-8 md:w-8', colors.text)} />
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">Concept Explainer</h1>
                  <p className="text-sm md:text-base text-muted-foreground">Describe what you want to learn about</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="topic">Topic to explain</Label>
                    <Input
                      id="topic"
                      placeholder="e.g., Quantum Mechanics, Machine Learning, Ancient Rome"
                      value={formData.topic}
                      onChange={(e) => updateFormData({ topic: e.target.value })}
                      className={cn('border-2', colors.border)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="knowledgeLevel">Your current knowledge level</Label>
                      <Select
                        value={formData.knowledgeLevel}
                        onValueChange={(value) => updateFormData({ knowledgeLevel: value })}
                      >
                        <SelectTrigger className={cn('border-2', colors.border)}>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          {KNOWLEDGE_LEVELS.map((level) => (
                            <SelectItem className='backdrop-blur-xl' key={level} value={level.toLowerCase()}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => updateFormData({ category: value })}
                      >
                        <SelectTrigger className={cn('border-2', colors.border)}>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {TOPIC_CATEGORIES.map((category) => (
                            <SelectItem className='backdrop-blur-xl' key={category} value={category.toLowerCase()}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="details">Additional context (optional)</Label>
                    <Textarea
                      id="details"
                      placeholder="Any specific aspects you want to focus on?"
                      value={formData.details}
                      onChange={(e) => updateFormData({ details: e.target.value })}
                      className={cn('min-h-20 border-2', colors.border)}
                    />
                  </div>

                  <Button
                    className={cn('w-full text-white font-medium mt-2', colors.button)}
                    onClick={startChat}
                    disabled={!formData.topic || !formData.knowledgeLevel}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Start Learning Session
                  </Button>
                </div>
              </Card>
            </div>
          ) : (
            <div className="w-full space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex gap-3 p-3 rounded-xl md:rounded-2xl transition-all duration-300',
                    message.sender === 'ai'
                      ? cn(colors.bg, colors.darkBg, 'border w-[70vw]', colors.border)
                      : 'bg-card border -ml-10 max-w-[60%]'
                  )}
                  style={{
                    marginLeft: message.sender === 'user' ? 'auto' : undefined,
                    marginRight: message.sender === 'ai' ? 'auto' : undefined
                  }}
                >
                  <div
                    className={cn(
                      'shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center',
                      message.sender === 'ai'
                        ? cn(colors.bg, 'border', colors.border)
                        : 'bg-primary/10 border border-primary/20'
                    )}
                  >
                    {message.sender === 'ai' ? (
                      <Bot className={cn('h-4 w-4 md:h-5 md:w-5', colors.text)} />
                    ) : (
                      <User className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm md:text-base">
                        {message.sender === 'ai' ? 'Concept Explainer' : 'You'}
                      </span>
                      <span className="text-xs md:text-sm text-muted-foreground">{message.timestamp}</span>
                    </div>
                    <div className="text-sm md:text-base">
                      <MarkdownPreview markdown={message.text} userRole={role} />
                    </div>
                  </div>
                </div>
              ))}
              
              {isSending && (
                <div
                  className={cn(
                    'flex gap-3 p-3 md:p-4 rounded-xl md:rounded-2xl transition-all duration-300',
                    cn(colors.bg, colors.darkBg, 'border', colors.border)
                  )}
                  style={{ marginRight: 'auto' }}
                >
                  <div
                    className={cn(
                      'shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center',
                      cn(colors.bg, 'border', colors.border)
                    )}
                  >
                    <Bot className={cn('h-4 w-4 md:h-5 md:w-5', colors.text)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm md:text-base">Concept Explainer</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs md:text-sm text-muted-foreground italic">Thinking...</span>
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <div ref={chatEndRef}/>
        </div>
        <ScrollBar orientation='vertical' />
      </ScrollArea>

      <div className="border-t bg-background/80 backdrop-blur-sm shrink-0">
        <div className="max-w-3xl mx-auto ">
          <div className="flex gap-3 items-center pt-4">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className={cn('flex-1 border-2 h-13 text-sm md:text-base', colors.border)}
              disabled={isSending}
            />
            <Button
              className={cn('text-white h-12 shrink-0', colors.button)}
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isSending}
            >
              {isSending?(
                <Loader2 className="h-5 w-5 animate-spin" />
              ):(
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};