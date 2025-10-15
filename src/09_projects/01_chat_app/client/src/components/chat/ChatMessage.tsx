import { cn } from '../../lib/utils';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div
      className={cn(
        'flex items-start',
        isUser && 'flex-row-reverse'
      )}
    >
      <div
        className={cn(
          'max-w-[75%] rounded-lg p-4',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted/50'
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {content}
        </p>
      </div>
    </div>
  );
}
