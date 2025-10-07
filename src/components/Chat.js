// src/components/Chat.js
import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNavigate, Link } from 'react-router-dom';
import apiService, { apiUtils } from '../services/apiService';

export default function Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const userId = apiUtils.getUserId();

  const handleLogout = () => {
    localStorage.removeItem('loginResponse');
    navigate('/login');
  };

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
    setError(null);
    const text = newMessage;
    setNewMessage('');
    setMessages(prev => [...prev, { content: text, role: 'user' }]);

    // Add a temporary "thinking" message
    const thinkingMessage = { content: '🤔 AI is thinking...', role: 'bot', isThinking: true };
    setMessages(prev => [...prev, thinkingMessage]);

    // Set up timeout warning after 15 seconds
    const timeoutWarning = setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.isThinking 
          ? { ...msg, content: '⏳ This is taking longer than usual. Please wait, the AI is processing your complex request...' }
          : msg
      ));
    }, 15000);

    try {
      // Validate userId before making the request
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const { data } = await apiService.chat.sendMessage(
        userId, 
        text,
        messages.length === 1 // Account for the thinking message
      );
      
      // Clear the timeout warning
      clearTimeout(timeoutWarning);
      
      if (!data) {
        throw new Error('No response received from server');
      }

      if (!data.response) {
        throw new Error('Invalid response format from server');
      }
      
      // Remove the thinking message and add the actual response
      setMessages(prev => prev.filter(msg => !msg.isThinking).concat({ content: data.response, role: 'bot' }));
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Clear the timeout warning and remove thinking message
      clearTimeout(timeoutWarning);
      setMessages(prev => prev.filter(msg => !msg.isThinking));
      
      // Handle authentication errors specifically
      if (error.message === 'User not authenticated' || error.response?.status === 401) {
        setTimeout(() => {
          handleLogout();
        }, 2000);
      }
      
      const errorMessage = apiUtils.handleApiError(error, 'Sorry, there was an error processing your message.');
      
      setError(errorMessage);
      setMessages(prev => [...prev, { content: errorMessage, role: 'bot' }]);
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
          <div className="flex items-center gap-4">
            <Link to="/" className="text-white hover:text-gray-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Chat
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">AI Powered</span>
            <button
              onClick={handleLogout}
              className="text-white hover:text-gray-200 transition-colors flex items-center gap-2"
            >
              <span>Logout</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 pt-20 pb-24">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] text-gray-500">
              <span className="text-6xl mb-4">👋</span>
              <h2 className="text-2xl font-semibold mb-2">Welcome!</h2>
              <p className="text-center">Start a conversation with our AI assistant.</p>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-[#128C7E] text-white rounded-br-none'
                        : message.isThinking
                        ? 'bg-blue-50 text-blue-600 rounded-bl-none shadow-md animate-pulse'
                        : message.content.includes('error') || message.content.includes('Error')
                        ? 'bg-red-50 text-red-600 rounded-bl-none shadow-md'
                        : 'bg-white text-gray-800 rounded-bl-none shadow-md'
                    }`}
                  >
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                        li: ({ children }) => <li className="mb-1">{children}</li>,
                        code: ({ children }) => (
                          <code className="bg-gray-100 rounded px-1 py-0.5">{children}</code>
                        ),
                        pre: ({ children }) => (
                          <pre className="bg-gray-100 rounded p-2 overflow-x-auto mb-2">
                            {children}
                          </pre>
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Container */}
      <div className="fixed bottom-0 right-0 md:left-64 left-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }} className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full border border-gray-300 rounded-full px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#128C7E] focus:border-transparent"
                disabled={loading}
              />
              <button
                type="button"
                onClick={startListening}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors ${
                  listening
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'text-gray-500 hover:text-[#128C7E]'
                }`}
                title={listening ? 'Stop listening' : 'Start voice input'}
              >
                {listening ? '🔴' : '🎤'}
              </button>
            </div>
            <button
              type="submit"
              disabled={!newMessage.trim() || loading}
              className="bg-[#128C7E] text-white px-6 py-3 rounded-full shadow hover:bg-[#075E54] disabled:opacity-50 transition-all duration-200"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Send'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
