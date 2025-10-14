import { useState } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileClick = () => {
    console.log('File upload clicked');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        className={cn(
          'flex items-end gap-2 rounded-lg border bg-background p-2 transition-colors',  
          disabled && 'opacity-50'
        )}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleFileClick}
          disabled={disabled}
          className="shrink-0 h-9 w-9"
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type here..."
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed min-h-[36px] max-h-[200px]"
        />

        <Button
          type="submit"
          size="icon"
          disabled={!input.trim() || disabled}
          className="shrink-0 h-9 w-9"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
}
