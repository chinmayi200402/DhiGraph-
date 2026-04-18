import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Bot, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AiChatbotProps {
  patientId: string;
  userId: string;
}

const AiChatbot: React.FC<AiChatbotProps> = ({ patientId, userId }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!query.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', content: query }]);
    setLoading(true);
    setQuery('');

    try {
      const res = await fetch('http://localhost:5000/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patient_id: patientId, user_id: userId, query })
      });

      if (!res.ok) throw new Error('AI query failed');
      
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
    } catch (err) {
      toast.error('Failed to get AI response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full h-[500px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-ayur-600" />
          Clinical Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            Ask me about patient history or treatment suggestions.
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 rounded-lg max-w-[80%] ${msg.role === 'user' ? 'bg-ayur-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                {msg.content}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="p-3 rounded-lg bg-gray-100 text-gray-800">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-4 border-t gap-2">
        <Input 
          disabled={loading}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your query..."
          className="flex-1"
        />
        <Button disabled={loading || !query.trim()} onClick={handleSend}>
          <Send className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AiChatbot;
