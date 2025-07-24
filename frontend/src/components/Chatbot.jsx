import React, { useState } from 'react';

const Chatbot = () => {
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'User', text: input };
    setChat(prev => [...prev, userMessage]);
    setInput('');

    const response = await fetch('http://localhost:5002/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    });

    const data = await response.json();
    const botMessage = { sender: 'Bot', text: data.reply };
    setChat(prev => [...prev, botMessage]);
  };

  return (
    <div className="max-w-md mx-auto p-4 font-sans">
      <h3 className="text-2xl font-bold mb-4 text-center"> Museum Chatbot</h3>

      <div className="border border-gray-300 p-4 h-72 overflow-y-scroll mb-4 rounded shadow-sm bg-white">
        {chat.map((msg, idx) => (
          <p key={idx} className="mb-2">
            <strong>{msg.sender}:</strong> {msg.text}
          </p>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-200"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
