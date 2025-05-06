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
  const recognitionRef = useRef(null);

  const userId = JSON.parse(localStorage.getItem('loginResponse'))?.id;

  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setNewMessage(prev => prev + ' ' + transcript);
      };

      recognitionRef.current.onend = () => {
        setListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setListening(false);
      };
    }
  }, []);

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
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    try {
      recognitionRef.current.start();
      setListening(true);
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setListening(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#128C7E] to-[#075E54] text-white px-6 py-4 shadow-lg fixed top-0 right-0 md:left-64 left-0 z-10">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-2xl">🩺</span> Medical Assistant
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Online</span>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 pt-20 pb-8">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <span className="text-6xl mb-4">👋</span>
            <h2 className="text-xl font-semibold mb-2">Welcome to Medical Assistant</h2>
            <p className="text-center max-w-md">I'm here to help you with your medical queries. How can I assist you today?</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            >
              <div
                className={`relative max-w-[80%] px-4 py-3 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white rounded-br-none'
                    : 'bg-white text-gray-800 rounded-bl-none shadow-lg'
                }`}
              >
                {msg.sender === 'bot' ? (
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
                <div
                  className={`absolute bottom-0 w-4 h-4 ${
                    msg.sender === 'user'
                      ? '-right-2 bg-[#25D366]'
                      : '-left-2 bg-white'
                  }`}
                  style={{
                    clipPath: msg.sender === 'user' 
                      ? 'polygon(0 0, 100% 100%, 100% 0)'
                      : 'polygon(0 0, 0 100%, 100% 0)'
                  }}
                />
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Container */}
      <div className="fixed bottom-0 right-0 md:left-64 left-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 px-4 py-4">
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          <textarea
            rows={1}
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Type your medical query..."
            className="flex-1 resize-none border border-gray-300 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-[#128C7E] focus:border-transparent transition-all duration-200"
            onKeyDown={e =>
              e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())
            }
            disabled={loading}
          />
          <button
            onClick={startListening}
            className={`text-[#128C7E] hover:text-[#075E54] p-3 rounded-full hover:bg-gray-100 transition-colors duration-200 ${
              listening ? 'animate-pulse bg-gray-100' : ''
            }`}
            title={listening ? "Listening..." : "Start voice input"}
          >
            {listening ? '🎤' : '🎤'}
          </button>
          <button
            onClick={sendMessage}
            disabled={loading || !newMessage.trim()}
            className="bg-[#128C7E] text-white p-3 rounded-full disabled:opacity-50 hover:bg-[#075E54] transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              '➤'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
