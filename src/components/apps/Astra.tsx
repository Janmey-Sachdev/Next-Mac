'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { astraChat } from '@/ai/flows/astra-flow';
import type { AstraChatInput } from '@/ai/flows/astra-types';
import { Loader2, Sparkles, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type Message = {
  role: 'user' | 'model';
  text: string;
};

export default function Astra() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Format history for the Genkit flow
      const history: AstraChatInput['history'] = messages.map((msg) => ({
        role: msg.role,
        content: [{ text: msg.text }],
      }));

      const result = await astraChat({ history, message: input });

      const modelMessage: Message = {
        role: 'model',
        text: result.response,
      };
      setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      console.error('Astra chat error:', error);
      toast({
        variant: 'destructive',
        title: 'Oh no! Something went wrong.',
        description: 'Astra is unable to respond right now.',
      });
      // Remove the user message if the call fails
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <header className="p-4 border-b flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-primary" />
        <h1 className="text-xl font-bold">Astra AI</h1>
      </header>
      <ScrollArea className="flex-grow p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                'flex items-start gap-3',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
              )}
              <div
                className={cn(
                  'p-3 rounded-lg max-w-sm',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary'
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              </div>
               {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
           {isLoading && (
            <div className="flex items-start gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="p-3 rounded-lg bg-secondary">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <footer className="p-4 border-t">
        <div className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Astra anything..."
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={isLoading}>
            Send
          </Button>
        </div>
      </footer>
    </div>
  );
}
