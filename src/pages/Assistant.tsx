import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '@/store/chatStore';
import { Send, Mic, Camera, Bot, Trash2 } from 'lucide-react';

export default function Assistant() {
  const { messages, addMessage, isLoading, simulateResponse, clearChat } = useChatStore();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');

    // Add user message
    addMessage({
      id: Date.now().toString(),
      role: 'user',
      content: userMsg,
      timestamp: new Date().toISOString(),
    });

    // Trigger AI response
    simulateResponse();
  };

  const isTyping = isLoading;

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] animate-fade-in">
      {/* Header */}
      <div className="px-4 pt-6 pb-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--gradient-hero)' }}>
            <Bot size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold font-heading">AI Asistan</h1>
            <p className="text-xs text-muted-foreground">Deney sorularını sor!</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-full hover:bg-muted"
            title="Sohbeti Temizle"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">🤖</div>
            <p className="font-bold font-heading">Merhaba!</p>
            <p className="text-sm text-muted-foreground mt-1">Deney hakkında soru sormak için yaz veya fotoğraf çek.</p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {['LED neden yanmıyor?', 'Mıknatıs nasıl çalışır?', 'Asit nedir?'].map((q) => (
                <button
                  key={q}
                  onClick={() => { setInput(q); }}
                  className="px-3 py-2 rounded-2xl bg-card border border-border text-xs font-medium tap-target hover:bg-muted transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'}
          >
            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
          </div>
        ))}

        {isTyping && (
          <div className="chat-bubble-assistant">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border bg-card">
        <div className="flex items-center gap-2">
          <button className="tap-target p-2 rounded-xl text-muted-foreground hover:bg-muted transition-colors">
            <Camera size={22} />
          </button>
          <button className="tap-target p-2 rounded-xl text-muted-foreground hover:bg-muted transition-colors">
            <Mic size={22} />
          </button>
          <input
            type="text"
            placeholder="Bir soru sor..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 px-4 py-3 rounded-2xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 tap-target"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="tap-target p-3 rounded-2xl transition-all disabled:opacity-40"
            style={{ background: input.trim() ? 'var(--gradient-hero)' : undefined }}
          >
            <Send size={18} className={input.trim() ? 'text-primary-foreground' : 'text-muted-foreground'} />
          </button>
        </div>
      </div>
    </div>
  );
}
