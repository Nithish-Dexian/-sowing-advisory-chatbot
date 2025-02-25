import React, { useState, useEffect } from 'react';
import { FaMicrophone, FaPaperPlane, FaSeedling, FaUser, FaRobot } from 'react-icons/fa';
import '../styles/Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Delay messages for smooth display
  const delayMessage = (newMessage) => {
    setTimeout(() => {
      setMessages((prev) => [...prev, newMessage]);
      if (newMessage.type === 'bot') {
        speakMessage(newMessage.text);
      }
    }, 1000 * (messages.length + 1));
  };

  // Send user input and get a bot response
  const handleSend = (overrideInput) => {
    const messageText = overrideInput || input;
    if (!messageText.trim()) return;

    const userMessage = { text: messageText, type: 'user' };
    setMessages((prev) => [...prev, userMessage]);

    // Simulated bot response
    const botResponse = { text: getBotResponse(messageText), type: 'bot' };
    delayMessage(botResponse);

    setInput('');
  };

  // Get bot response based on user input
  const getBotResponse = (userInput) => {
    if (userInput.toLowerCase().includes('weather')) {
      return "I can't fetch real-time weather, but you can check a weather website.";
    }
    return "I'm here to assist you with sowing. Please ask your question.";
  };

  // Text-to-Speech: Make the bot speak
  const speakMessage = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    } else {
      alert('Speech synthesis not supported in this browser.');
    }
  };

  // Speech Recognition: Capture user voice input
  const handleSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleSend(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="chat-container">
      <h1 className="chat-header">
        <FaSeedling /> Sowing Advisory Chatbot
      </h1>
      <p className="chat-subtitle">Ask for sowing and farming advice!</p>

      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.type}`}>
            {msg.type === 'user' ? <FaUser /> : <FaRobot />} {msg.text}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your query..."
        />
        <button onClick={() => handleSend()} className="send-button" title="Send">
          <FaPaperPlane />
        </button>
        <button onClick={handleSpeechRecognition} className="speak-button" title="Speak">
          <FaMicrophone />
        </button>
      </div>

      <footer className="chat-footer">© 2025 Sowing Advisory Chatbot</footer>
    </div>
  );
};

export default Chatbot;
