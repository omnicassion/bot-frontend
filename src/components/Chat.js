// src/components/Chat.js
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const messagesEndRef = useRef(null);

  const recognition = window.SpeechRecognition
    ? new (window.SpeechRecognition || window.webkitSpeechRecognition)()
    : null;
  const userId = JSON.parse(localStorage.getItem('loginResponse'))?.id;

  useEffect(() => {
    (async function fetchHistory() {
      try {
        const { data } = await axios.get(
          `https://bot-backend-cy89.onrender.com/api/chat/history/${userId}`
        );
        setMessages(data);
      } catch {
        // handle error
      }
    })();
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    setLoading(true);
    const text = newMessage;
    setNewMessage('');
    setMessages(prev => [...prev, { content: text, sender: 'user' }]);

    try {
      const { data } = await axios.post(
        'https://bot-backend-cy89.onrender.com/api/chat/message',
        { userId, message: text }
      );
      setMessages(prev => [...prev, { content: data.response, sender: 'bot' }]);
    } catch {
      // error handling
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    if (!recognition) return;
    recognition.start();
    setListening(true);
    recognition.onresult = event => {
      const speech = event.results[0][0].transcript;
      setNewMessage(prev => prev + ' ' + speech);
    };
    recognition.onend = () => setListening(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`relative w-auto max-w-2xl px-5 py-3 rounded-lg leading-tight
                ${msg.sender === 'user'
                  ? 'bg-green-500 text-white rounded-br-none'
                  : 'bg-white text-gray-800 rounded-bl-none shadow'}
              `}
            >
              {msg.sender === 'bot' ? (
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              ) : (
                msg.content
              )}
              {/* Tail */}
              <span
                className={`absolute bottom-0 
                  ${msg.sender === 'user' ? '-mb-1 right-0' : '-mb-1 left-0'} 
                  w-3 h-3 bg-transparent`}
              >
                <svg
                  className={msg.sender === 'user' ? 'rotate-45' : '-rotate-45'}
                  width="14"
                  height="14"
                  viewBox="0 0 10 10"
                  fill={msg.sender === 'user' ? '#22c55e' : '#ffffff'}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="10" height="10" />
                </svg>
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white p-3 flex items-center gap-2 sticky bottom-0">
        <textarea
          rows={1}
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Type a message"
          className="flex-1 resize-none border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          onKeyDown={e =>
            e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())
          }
          disabled={loading}
        />
        <button
          onClick={startListening}
          className="text-green-500 hover:text-green-600 p-2"
        >
          🎤
        </button>
        <button
          onClick={sendMessage}
          disabled={loading || !newMessage.trim()}
          className="bg-green-500 text-white p-2 rounded-full disabled:opacity-50"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
