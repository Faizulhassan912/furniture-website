import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, Send, BotMessageSquare, X, Loader2, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  
  const messagesEndRef = useRef(null);

  // Show attractive teaser badge after 1.5s, then automatically disappear after 5s
  useEffect(() => {
    let hideTimer;
    const showTimer = setTimeout(() => {
      setShowTeaser(true);

      // Auto dismiss after 5 seconds of display
      hideTimer = setTimeout(() => {
        setShowTeaser(false);
      }, 5000);
    }, 1500);

    return () => {
      clearTimeout(showTimer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e, customText = null) => {
    if (e) e.preventDefault();
    const textToSend = customText || input;
    if (!textToSend.trim()) return;

    setShowQuickReplies(false);
    const userMessage = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Network response was not ok');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I am having trouble connecting right now. Please try again later or contact us on WhatsApp!' }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Convert basic markdown (bold, links, images) to HTML elements
  const formatText = (text) => {
    if (!text) return null;
    
    // Split by newlines first
    const lines = text.split('\n');
    
    return lines.map((line, lineIdx) => {
      // Very basic parser for links [text](url) and images ![alt](url) and bold **text**
      // This is a simplified regex approach for chat bubbles
      let formattedLine = [];
      let currentIndex = 0;
      
      const regex = /!\[([^\]]+)\]\(([^)]+)\)|\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
      let match;
      
      while ((match = regex.exec(line)) !== null) {
        // Add text before match
        if (match.index > currentIndex) {
          formattedLine.push(line.substring(currentIndex, match.index));
        }
        
        if (match[1] && match[2]) {
          // Image: ![alt](url)
          formattedLine.push(
            <div key={`${lineIdx}-${match.index}`} className="my-2 rounded-xl overflow-hidden border border-border shadow-sm">
              <img src={match[2]} alt={match[1]} className="w-full h-auto object-cover max-h-48" loading="lazy" />
            </div>
          );
        } else if (match[3] && match[4]) {
          // Link: [text](url)
          formattedLine.push(
            <a key={`${lineIdx}-${match.index}`} href={match[4]} className="text-primary hover:text-primary-dark underline underline-offset-2 font-medium transition-colors" target="_blank" rel="noopener noreferrer">
              {match[3]}
            </a>
          );
        } else if (match[5]) {
          // Bold: **text**
          formattedLine.push(<strong key={`${lineIdx}-${match.index}`} className="font-bold">{match[5]}</strong>);
        }
        
        currentIndex = regex.lastIndex;
      }
      
      // Add remaining text
      if (currentIndex < line.length) {
        formattedLine.push(line.substring(currentIndex));
      }
      
      return (
        <span key={lineIdx}>
          {formattedLine}
          {lineIdx < lines.length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <div className="fixed bottom-[4.5rem] right-4 sm:bottom-24 sm:right-6 z-[60] flex flex-col items-end pointer-events-none">
      
      {/* Chat Window */}
      <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.5, y: 50, transformOrigin: "bottom right" }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 50 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="backdrop-blur-xl bg-bg-card/95 border border-border/50 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] rounded-2xl w-[85vw] sm:w-[350px] md:w-[400px] h-[400px] sm:h-[500px] max-h-[65vh] sm:max-h-[75vh] flex flex-col mb-4 overflow-hidden pointer-events-auto mr-0 sm:mr-0"
        >
          
          {/* Header */}
          <div className="bg-primary text-white p-4 flex justify-between items-center shadow-md relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
            
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30 shadow-inner">
                <Bot size={22} className="text-white drop-shadow-md" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide flex items-center gap-1">
                  S. Support <Sparkles size={14} className="text-yellow-300" />
                </h3>
                <p className="text-[10px] text-white/80 font-medium uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_5px_#4ade80]"></span> Online
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              aria-label="Close Chat Window"
              className="text-white/80 hover:text-white transition-colors cursor-pointer relative z-10 p-1 bg-white/10 hover:bg-white/20 rounded-full"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 bg-bg-alt/30 relative flex flex-col">
            {messages.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-light text-white rounded-full flex items-center justify-center mb-4 shadow-lg shadow-primary/20 border border-primary/20">
                  <Bot size={32} />
                </div>
                <h4 className="text-lg font-bold text-text mb-2">Assalam O Alaikum! 👋</h4>
                <p className="text-sm text-text-light leading-relaxed mb-6">
                  Welcome to S. Kids Furniture. I am S. Support. How can I help you find the best furniture today?
                </p>
                
                {showQuickReplies && (
                  <div className="flex flex-col gap-2 w-full mt-auto">
                    <button onClick={() => handleSend(null, "Show Bunk Beds")} className="text-sm px-4 py-2 bg-bg-card border border-border hover:border-primary hover:text-primary rounded-xl shadow-sm transition-all text-left flex items-center gap-2">
                      🛏️ Show Bunk Beds
                    </button>
                    <button onClick={() => handleSend(null, "Do you have Car Beds?")} className="text-sm px-4 py-2 bg-bg-card border border-border hover:border-primary hover:text-primary rounded-xl shadow-sm transition-all text-left flex items-center gap-2">
                      🚗 Show Car Beds
                    </button>
                    <button onClick={() => handleSend(null, "What is your delivery policy out of Lahore?")} className="text-sm px-4 py-2 bg-bg-card border border-border hover:border-primary hover:text-primary rounded-xl shadow-sm transition-all text-left flex items-center gap-2">
                      🚚 Delivery Outside Lahore
                    </button>
                  </div>
                )}
              </motion.div>
            )}
            
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-[85%] gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center ${msg.role === 'user' ? 'bg-accent text-white' : 'bg-primary text-white'}`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>

                  {/* Bubble */}
                  <div className={`p-3 rounded-2xl whitespace-pre-wrap text-[15px] leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-br from-accent to-accent-light text-text-on-accent rounded-tr-none' 
                      : 'bg-bg-card border border-border text-text rounded-tl-none'
                  }`}>
                    {formatText(msg.text)}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex max-w-[80%] gap-2 flex-row">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex shrink-0 items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div className="p-3 rounded-2xl bg-bg-card border border-border text-text rounded-tl-none shadow-sm flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-primary" />
                    <span className="text-xs text-text-light">Typing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 border-t border-border bg-bg-card flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (input.trim() && !isLoading) handleSend(e);
                }
              }}
              placeholder="Type your message..."
              aria-label="Chat message input"
              className="flex-1 bg-bg-alt border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-text resize-none custom-scrollbar"
              rows={2}
              disabled={isLoading}
            />
            <button 
              type="submit" 
              onClick={(e) => { if (!input.trim() || isLoading) e.preventDefault(); }}
              disabled={!input.trim() || isLoading}
              aria-label="Send Message"
              className="w-10 h-10 mb-1 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0 cursor-pointer"
            >
              <Send size={18} className="ml-1" />
            </button>
          </form>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Chat Toggle Button & Floating Interactive Teaser */}
      {!isOpen && (
        <div className="relative flex items-center pointer-events-auto">
          
          {/* Floating Interactive Teaser Card */}
          <AnimatePresence>
            {showTeaser && (
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.85 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.85 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="absolute right-full top-1/2 -translate-y-1/2 mr-2.5 sm:mr-3.5 bg-bg-card/95 backdrop-blur-md border border-primary/30 dark:border-primary/40 rounded-2xl p-2.5 sm:p-3.5 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_35px_-5px_rgba(0,0,0,0.7)] w-[65vw] max-w-[260px] sm:w-72 pointer-events-auto cursor-pointer hover:border-primary transition-all duration-300 group z-50"
                onClick={() => {
                  setIsOpen(true);
                  setShowTeaser(false);
                }}
              >
                {/* Header row */}
                <div className="flex items-center justify-between gap-2 mb-1 sm:mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-[11px] sm:text-xs font-bold text-primary dark:text-primary-light flex items-center gap-1">
                      S. AI Support <Sparkles size={11} className="text-yellow-400 fill-yellow-400" />
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowTeaser(false);
                    }}
                    className="text-text-light hover:text-text p-0.5 sm:p-1 rounded-full hover:bg-bg-alt transition-colors"
                    aria-label="Dismiss AI Assistant suggestion"
                  >
                    <X size={13} />
                  </button>
                </div>

                {/* Body message */}
                <p className="text-[11px] sm:text-xs text-text leading-snug font-medium line-clamp-2 sm:line-clamp-none">
                  Need help finding the best bed, wardrobe, or custom size? Let's chat! 💬
                </p>

                {/* Action CTA pill */}
                <div className="mt-2 sm:mt-2.5 flex items-center justify-between text-[10px] sm:text-[11px] font-semibold text-primary group-hover:translate-x-0.5 transition-transform">
                  <span className="bg-primary/10 dark:bg-primary/20 px-2 sm:px-2.5 py-0.5 rounded-full border border-primary/20 flex items-center gap-1">
                    Ask AI Assistant ✨
                  </span>
                  <span className="text-text-light group-hover:text-primary transition-colors text-[10px] sm:text-xs">Start →</span>
                </div>

                {/* Little triangle arrow pointing to the button */}
                <div className="absolute right-[-5px] sm:right-[-6px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-bg-card rotate-45 border-t border-r border-primary/30 dark:border-primary/40"></div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Action Button */}
          <button
            onClick={() => { setIsOpen(true); setShowTeaser(false); }}
            className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-primary-light text-white rounded-full flex items-center justify-center shadow-[0_8px_25px_rgba(var(--color-primary),0.5)] hover:shadow-[0_12px_35px_rgba(var(--color-primary),0.8)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer relative group"
            aria-label="Open AI Customer Assistant Chat"
          >
            {/* Ripple effect rings */}
            <div className="absolute inset-0 rounded-full border-2 border-primary/60 animate-ping opacity-60 pointer-events-none"></div>
            
            {/* Sparkling Notification Dot */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-gradient-to-tr from-yellow-400 to-amber-300 border-2 border-bg-card shadow-sm items-center justify-center text-[8px] font-extrabold text-slate-900">
                ✨
              </span>
            </span>

            <div className="relative">
              <BotMessageSquare size={28} className="sm:w-8 sm:h-8 w-7 h-7 drop-shadow-md group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
