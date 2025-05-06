import React, { useState, useEffect } from 'react';
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

    const loginResponse = JSON.parse(localStorage.getItem('loginResponse'));
    const userId = loginResponse?.id;

    useEffect(() => {
        fetchChatHistory();
    }, []);

    const fetchChatHistory = async () => {
        try {
            const response = await axios.get(`https://bot-backend-cy89.onrender.com/api/chat/history/${userId}`);
            setMessages(response.data);
        } catch (err) {
            setError('Failed to load chat history');
            console.error('Error fetching chat history:', err);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        setLoading(true);
        setError(null);

        const userMessage = {
            content: newMessage,
            sender: 'user',
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setNewMessage('');

        try {
            const response = await axios.post('https://bot-backend-cy89.onrender.com/api/chat/message', {
                userId,
                message: newMessage,
            });

            const botMessage = {
                content: response.data.response,
                sender: 'bot',
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, botMessage]);

            if (response.data.severity === 'high') {
                alert('⚠️ Warning: Your symptoms may require immediate medical attention!');
            }
        } catch (err) {
            setError('Failed to send message');
            console.error('Error sending message:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const startListening = () => {
        if (!recognition) return alert('Speech recognition not supported in this browser');
        recognition.continuous = false;
        recognition.lang = 'en-US';

        recognition.start();
        setListening(true);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setNewMessage((prev) => prev + ' ' + transcript);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event);
            setListening(false);
        };

        recognition.onend = () => {
            setListening(false);
        };
    };

    return (
        <div className="flex flex-col h-screen bg-white text-black">
            {/* Image Banner */}
            <div className="">
                <img
                    src="/machine.jpg" // <- Save your uploaded image here
                    alt="Radiation Therapy Machine"
                    className=" max-h-20 object-cover sm:rounded-b-lg shadow"
                />
            </div>

            {/* Header */}
            <div className="text-center text-xl font-semibold text-blue-700 py-2">
                👋 Welcome! I'm your Radiation Therapy Assistant
            </div>

            {/* Chat container */}
            <div className="flex-1 overflow-y-auto px-4 space-y-4 bg-blue-50">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                        <div
                            className={`max-w-sm p-3 rounded-lg ${
                                message.sender === 'user'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-800'
                            }`}
                        >
                            {message.sender === 'bot' ? (
                                <ReactMarkdown>{message.content}</ReactMarkdown>
                            ) : (
                                message.content
                            )}
                        </div>
                    </div>
                ))}
                {loading && <div className="text-gray-600 italic text-sm">Bot is typing...</div>}
                {error && <div className="text-red-600 text-sm font-medium">{error}</div>}
            </div>

            {/* Input Section */}
            <div className="p-4 bg-white shadow-inner sticky bottom-0 z-10">
                <div className="flex flex-col sm:flex-row gap-2">
                    <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Describe your symptoms..."
                        disabled={loading}
                        rows={2}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    <button
                        onClick={startListening}
                        className={`bg-blue-700 hover:bg-blue-700 text-white px-3 rounded-lg ${
                            listening ? 'animate-pulse' : ''
                        }`}
                    >
                        🎤 {listening ? 'Listening...' : ''}
                    </button>

                    <button
                        onClick={sendMessage}
                        disabled={loading || !newMessage.trim()}
                        className="bg-blue-700 hover:bg-blue-700 text-white px-3 rounded-lg disabled:opacity-50"
                    >
                        {loading ? 'Sending...' : 'Send'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Chat;
