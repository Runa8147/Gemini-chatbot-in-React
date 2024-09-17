import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-AI";
import './styles.css'; // Import your CSS file

const App = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatCount, setChatCount] = useState(0); // Track chat count

  useEffect(() => {
    // ... (No initial API call needed as you don't want an initial prompt)
  }, []);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async () => {
    if (userInput.trim() === '') {
      return;
    }

    setIsLoading(true);
    setMessages([...messages, { role: "user", content: userInput }]);
    setUserInput('');

    try {
      const API_KEY = your_api_key_here; // Replace with your actual API key
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Generate a response to the following prompt: "${userInput}"`;

      const result = await model.generateContent(prompt);
      setMessages([...messages, { role: "assistant", content: result.response.text() }]);
    } catch (error) {
      console.error("Error generating response:", error);
    } finally {
      setIsLoading(false);
      setChatCount(chatCount + 1); // Increment chat count after each user message
    }
  };

  return (
    <div className="chatbot-container">
      <h2>Chat Counter: {chatCount} (Max: 4)</h2>
      <ul className="message-list">
        {messages.slice(-4).map((message, index) => (
          <li key={index}>
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
          disabled={chatCount >= 4}
        />
        <button className="send-button" onClick={handleSubmit} disabled={chatCount >= 4}>
          Send
        </button>
      </div>
      {isLoading && <p>Loading...</p>}
    </div>
  );
};

export default App;
