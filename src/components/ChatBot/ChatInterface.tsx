import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { MessageSquare, Send, X, Minimize2, Loader } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { generateResponse } from '../../lib/ai/gemini';
import { sendProfessionalEmail } from '../../lib/email/sender';
import { calculateWellnessScore } from '../../lib/crm/wellness';

interface Message {
  text: string;
  isBot: boolean;
  type?: 'alert' | 'success' | 'info' | 'reminder' | 'default';
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    { text: "👋 Hi! I'm your AI assistant. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initializeChat = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        await checkWellness(user.id);
      }
    };
    initializeChat();
  }, []);

  const checkWellness = async (userId: string) => {
    try {
      const { score, message } = await calculateWellnessScore(userId);
      if (score > 70) {
        setMessages(prev => [...prev, {
          text: `⚠️ ${message}`,
          isBot: true,
          type: 'alert'
        }]);
      }
    } catch (error) {
      console.error('Error checking wellness:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isMinimized) {
      inputRef.current?.focus();
    }
  }, [isMinimized]);

  const handleSend = async () => {
    if (!input.trim() || !user || isLoading) return;

    setIsLoading(true);
    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    setInput('');
    setIsTyping(true);

    try {
      if (userMessage.toLowerCase().includes('send email')) {
        try {
          await sendProfessionalEmail(user.id, userMessage);
          setMessages(prev => [...prev, {
            text: "Email sent successfully! ✉️",
            isBot: true,
            type: 'success'
          }]);
        } catch (error: any) {
          setMessages(prev => [...prev, {
            text: `Failed to send email: ${error.message}`,
            isBot: true,
            type: 'alert'
          }]);
        }
      } else {
        const response = await generateResponse(userMessage, user.id);
        setMessages(prev => [...prev, {
          text: response,
          isBot: true
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        text: "Sorry, I encountered an error. Please try again.",
        isBot: true,
        type: 'alert'
      }]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getEmoji = (type?: Message['type']) => {
    const emojis = {
      reminder: '⏰',
      alert: '⚠️',
      success: '✅',
      info: 'ℹ️',
      default: '🤖'
    };
    return emojis[type || 'default'];
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${isMinimized ? '' : 'w-96'}`}>
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
        >
          <MessageSquare className="h-6 w-6 text-white" />
        </button>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col h-[500px] transform transition-all duration-300 scale-in-center">
          <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span className="font-medium">AI Assistant</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'} animate-fade-in`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg shadow-sm ${
                    msg.isBot
                      ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                  } transform transition-all duration-300 hover:scale-[1.02]`}
                >
                  {msg.isBot && msg.type && (
                    <span className="mr-2">{getEmoji(msg.type)}</span>
                  )}
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                  <Loader className="h-5 w-5 animate-spin text-indigo-600" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className={`px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105 ${
                  isLoading || !input.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:from-indigo-700 hover:to-purple-700'
                }`}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}