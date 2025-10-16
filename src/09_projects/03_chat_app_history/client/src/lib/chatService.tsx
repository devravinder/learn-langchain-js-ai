export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }
  
  const AI_RESPONSES = [
    "That's an interesting question! Let me help you with that.",
    "I understand what you're asking. Here's what I think...",
    "Great point! From my perspective, this is how I would approach it.",
    "Thanks for sharing that with me. I'd be happy to discuss this further.",
    "I appreciate your question. Let me provide some insight on this topic.",
    "That's a thoughtful inquiry. Here's my take on the matter.",
    "I see where you're coming from. Let me offer a different perspective.",
    "Excellent question! This is definitely worth exploring in more detail.",
  ];
  
  const getRandomResponse = (): string => {
    const randomIndex = Math.floor(Math.random() * AI_RESPONSES.length);
    return AI_RESPONSES[randomIndex]!;
  };
  
  export const generateAIResponse = async (userMessage: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));
  
    const response = getRandomResponse();
    const contextualAddition = userMessage.length > 50
      ? " That's quite a detailed message you've sent. I've taken time to consider all aspects of your input."
      : " Feel free to ask me more questions or share your thoughts!";
  
    return response + contextualAddition;
  };
  
  export const createMessage = (role: 'user' | 'assistant', content: string): Message => ({
    id: crypto.randomUUID(),
    role,
    content,
    timestamp: new Date(),
  });
  