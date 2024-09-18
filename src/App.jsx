import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import './styles.css';

const API_KEY = "AIzaSyDKv4gjBMYe_OszgWMz7Lcns4900oVBhP0"; // Replace with your actual API key
const genAI = new GoogleGenerativeAI(API_KEY);

const App = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatCount, setChatCount] = useState(0);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async () => {
    if (userInput.trim() === '' || chatCount >= 4) {
      return;
    }

    setIsLoading(true);
    const newUserMessage = { role: "user", content: userInput };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setUserInput('');
    setChatCount(prevCount => prevCount + 1);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const result = await model.generateContent(userInput);
      const newAssistantMessage = { role: "assistant", content: result.response.text() };
      setMessages(prevMessages => [...prevMessages, newAssistantMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
      setMessages(prevMessages => [...prevMessages, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <h2>Chat Counter: {chatCount} (Max: 4)</h2>
      <ul className="message-list">
        {messages.map((message, index) => (
          <li key={index} className={message.role}>
            <strong>{message.role}:</strong> {message.content}
          </li>
        ))}
      </ul>
      <div className="input-container">
        <input
          className="input-field"
          type="text"
          value={userInput}
          onChange={handleInputChange}
          disabled={chatCount >= 4 || isLoading}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <button 
          className="send-button" 
          onClick={handleSubmit} 
          disabled={chatCount >= 4 || isLoading}
        >
          Send
        </button>
      </div>
      {isLoading && <p>Loading...</p>}
    </div>
  );
};

export default App;