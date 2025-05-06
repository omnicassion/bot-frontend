// src/components/Chat.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [listening, setListening] = useState(false);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;
  const userId = JSON.parse(localStorage.getItem('loginResponse'))?.id;

  useEffect(() => {
    fetchChatHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchChatHistory = async () => {
    try {
      const { data } = await axios.get(
        `https://bot-backend-cy89.onrender.com/api/chat/history/${userId}`
      );
      setMessages(data);
    } catch {
      setError('Failed to load chat history');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    setLoading(true);
    try {
      // add user message to UI immediately
      setMessages((prev) => [
        ...prev,
        { content: newMessage, sender: 'user', timestamp: new Date() },
      ]);
      setNewMessage('');

      const { data } = await axios.post(
        'https://bot-backend-cy89.onrender.com/api/chat/message',
        { userId, message: newMessage }
      );

      setMessages((prev) => [
        ...prev,
        { content: data.response, sender: 'bot', timestamp: new Date() },
      ]);

      if (data.severity === 'high') {
        alert('⚠️ Warning: Your symptoms may require immediate medical attention!');
      }
    } catch {
      setError('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    if (!recognition) return alert('Speech recognition not supported');
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.start();
    setListening(true);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setNewMessage((prev) => prev + ' ' + transcript);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      {/* Header */}
      <header className="text-center text-xl font-semibold text-blue-700 py-2">
        👋 Welcome! I'm your Radiation Therapy Assistant
      </header>

      {/* Chat history */}
      <div className="flex-1 overflow-auto px-4 py-2 space-y-4 bg-blue-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs md:max-w-md p-3 rounded-lg ${
                msg.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {msg.sender === 'bot' ? (
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        {loading && <div className="text-gray-600 italic text-sm">Bot is typing...</div>}
        {error && <div className="text-red-600 text-sm font-medium">{error}</div>}
      </div>

      {/* Input bar (always visible) */}
      <div className="bg-white shadow-inner p-4">
        <div className="flex flex-wrap gap-2">
          <textarea
            rows={2}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Describe your symptoms..."
            disabled={loading}
            className="flex-1 min-w-[150px] px-3 py-2 rounded-lg border border-gray-300 resize-none
                       focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={startListening}
            className={`bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded-lg
                       ${listening ? 'animate-pulse' : ''}`}
          >
            🎤 {listening ? 'Listening...' : ''}
          </button>
          <button
            onClick={sendMessage}
            disabled={loading || !newMessage.trim()}
            className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Sending…' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
