import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Lightbulb,
  Loader2,
  Minimize2,
  Maximize2
} from "lucide-react";
import { ProblemDetail } from "@/types";

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatProps {
  problem: ProblemDetail;
  userCode: string;
  hintsUsed: number;
  userLevel?: number;
}

export function AIChat({ problem, userCode, hintsUsed, userLevel = 1 }: AIChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [questionsUsed, setQuestionsUsed] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const MAX_QUESTIONS = 10; // Free tier limit

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || questionsUsed >= MAX_QUESTIONS) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          context: {
            problem: {
              title: problem.title,
              description: problem.description,
              difficulty: problem.difficulty,
              researchTopics: problem.researchTopics,
              learningObjectives: problem.learningObjectives
            },
            userCode,
            hintsUsed,
            userLevel,
            chatHistory: messages.slice(-4) // Last 4 messages for context
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setQuestionsUsed(prev => prev + 1);
    } catch (error) {
      console.error('AI Chat error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble right now. Please try again in a moment!",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startNewChat = () => {
    const welcomeMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `Hi! I'm your AI Python tutor. I can help you with "${problem.title}" - ask me about concepts, debugging, or if you're stuck on any part of the problem. What would you like to know?`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => {
            setIsOpen(true);
            if (messages.length === 0) {
              startNewChat();
            }
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg rounded-full w-14 h-14 p-0"
          title="Ask AI Tutor"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
        
        {/* Question counter badge */}
        <Badge className="absolute -top-2 -left-2 bg-orange-500 text-white text-xs">
          {questionsUsed}/{MAX_QUESTIONS}
        </Badge>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 bg-white border border-gray-200 rounded-lg shadow-xl transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
    }`}>
      {/* Chat Header */}
      <CardHeader className="pb-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">AI Python Tutor</CardTitle>
              <div className="text-xs text-gray-500">
                {questionsUsed}/{MAX_QUESTIONS} questions used
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="w-6 h-6 p-0"
            >
              {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="w-6 h-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
        
        {/* Usage warning */}
        {questionsUsed >= MAX_QUESTIONS - 2 && (
          <div className="bg-amber-50 border border-amber-200 rounded p-2 mt-2">
            <div className="text-xs text-amber-800">
              {questionsUsed >= MAX_QUESTIONS 
                ? "You've reached your question limit. Upgrade for unlimited AI help!"
                : `${MAX_QUESTIONS - questionsUsed} questions remaining today.`
              }
            </div>
          </div>
        )}
      </CardHeader>

      {!isMinimized && (
        <>
          {/* Chat Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4 h-[420px]">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[85%] ${
                    message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="w-3 h-3" />
                      ) : (
                        <Bot className="w-3 h-3" />
                      )}
                    </div>
                    
                    <div className={`rounded-lg p-3 text-sm ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      <div className={`text-xs mt-1 opacity-70 ${
                        message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                      <Bot className="w-3 h-3 text-gray-600" />
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3">
                      <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          {/* Chat Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  questionsUsed >= MAX_QUESTIONS 
                    ? "Question limit reached..."
                    : "Ask about Python concepts, debugging, or this problem..."
                }
                disabled={isLoading || questionsUsed >= MAX_QUESTIONS}
                className="flex-1 text-sm"
              />
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading || questionsUsed >= MAX_QUESTIONS}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            
            {/* Quick suggestions */}
            {messages.length === 1 && (
              <div className="mt-2 flex flex-wrap gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-6"
                  onClick={() => setInputMessage("How do I validate the username?")}
                >
                  <Lightbulb className="w-3 h-3 mr-1" />
                  Validation help
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-6"
                  onClick={() => setInputMessage("What's wrong with my code?")}
                >
                  Debug my code
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-6"
                  onClick={() => setInputMessage("Explain isinstance()")}
                >
                  Explain concepts
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}