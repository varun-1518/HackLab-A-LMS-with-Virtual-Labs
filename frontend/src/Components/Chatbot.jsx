import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './css/chatbot.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faPaperPlane, faTimes, faRotateRight } from '@fortawesome/free-solid-svg-icons';

// Function to parse markdown-style bold text (**text** or __text__)
const parseBoldText = (text) => {
  // Replace **text** with <strong>text</strong>
  let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Also replace __text__ with <strong>text</strong> (alternative markdown syntax)
  formattedText = formattedText.replace(/__(.*?)__/g, '<strong>$1</strong>');
  return formattedText;
};

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your cybersecurity assistant. Ask me any security-related questions!", sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [lastQuery, setLastQuery] = useState('');
  const [apiConnected, setApiConnected] = useState(false);
  const messagesEndRef = useRef(null);

  // Check if the API is available when the component mounts
  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/chatbot/hello');
        if (response.data && response.data.status === 'success') {
          console.log('Chatbot API connected successfully');
          setApiConnected(true);
        }
      } catch (error) {
        console.error('Chatbot API connection failed:', error);
        setApiConnected(false);
      }
    };
    
    checkApiConnection();
  }, []);

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleRetry = async () => {
    if (lastQuery) {
      setHasError(false);
      await sendQuery(lastQuery);
    }
  };

  const sendQuery = async (query) => {
    setIsLoading(true);
    setLastQuery(query);

    try {
      console.log('Sending query to chatbot API:', query);
      
      // Make API call to backend which will call Gemini
      const response = await axios.post('http://localhost:8080/api/chatbot/query', {
        query: query
      }, {
        timeout: 15000 // 15 second timeout
      });

      console.log('Received response:', response.data);

      if (response.data && response.data.response) {
        // Add bot response to chat
        setMessages(prev => [...prev, { text: response.data.response, sender: 'bot' }]);
        setHasError(false);
        setApiConnected(true);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching chatbot response:', error);
      setHasError(true);
      
      // Set appropriate error message
      let errorMessage = 'Sorry, I encountered an error processing your request. You can try again or rephrase your question.';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'The request timed out. The server might be busy. Please try again later.';
        setApiConnected(false);
      } else if (!error.response) {
        errorMessage = 'Cannot connect to the server. Please check your internet connection and try again.';
        setApiConnected(false);
      } else if (error.response.status >= 500) {
        errorMessage = 'The server encountered an error. Our team has been notified. Please try again later.';
      }
      
      setMessages(prev => [...prev, { 
        text: errorMessage, 
        sender: 'bot',
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Add user message to chat
    const userMessage = { text: inputText, sender: 'user' };
    setMessages([...messages, userMessage]);
    setInputText('');
    
    await sendQuery(inputText.trim());
  };

  // Custom styles to ensure visibility
  const botMessageStyle = {
    backgroundColor: '#2c2c2c',
    color: 'white', 
    fontWeight: 'normal',
    textShadow: '0 0 1px rgba(0, 0, 0, 0.5)',
    fontSize: '16px',
    lineHeight: '1.4'
  };
  
  const userMessageStyle = {
    backgroundColor: '#00ffcc',
    color: 'black',
    fontWeight: '500',
    textShadow: '0 0 1px rgba(0, 0, 0, 0.3)',
    fontSize: '16px',
    lineHeight: '1.4'
  };
  
  const errorMessageStyle = {
    backgroundColor: 'rgba(255, 68, 68, 0.2)',
    borderLeft: '3px solid #ff4444',
    color: '#ff4444'
  };

  return (
    <div className="chatbot-container">
      {/* Chat toggle button */}
      <button className="chat-toggle-btn" onClick={toggleChat} title="Cybersecurity Assistant">
        <FontAwesomeIcon icon={isOpen ? faTimes : faCommentDots} />
        {!isOpen && <span className="tooltip">Cybersecurity Assistant</span>}
        {!apiConnected && !isOpen && <span className="api-status offline"></span>}
        {apiConnected && !isOpen && <span className="api-status online"></span>}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="chat-window" style={{ backgroundColor: '#1e1e1e' }}>
          <div className="chat-header" style={{ backgroundColor: '#121212' }}>
            <h3 style={{ color: '#00ffcc' }}>Cybersecurity Assistant</h3>
            {apiConnected ? 
              <span className="status-indicator connected" style={{ color: '#00ffcc' }}>Connected</span> : 
              <span className="status-indicator disconnected" style={{ color: '#ff4444' }}>Offline Mode</span>
            }
          </div>
          <div className="chat-messages" style={{ backgroundColor: '#121212' }}>
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message.sender} ${message.isError ? 'error' : ''}`}
                style={message.sender === 'bot' 
                  ? message.isError ? {...botMessageStyle, ...errorMessageStyle} : botMessageStyle 
                  : userMessageStyle
                }
              >
                <div 
                  className="message-content" 
                  style={{ color: message.sender === 'bot' ? 'white' : 'black' }}
                  dangerouslySetInnerHTML={{ __html: parseBoldText(message.text) }}
                >
                </div>
                {message.isError && (
                  <button className="retry-btn" onClick={handleRetry} style={{ color: '#ff4444' }}>
                    <FontAwesomeIcon icon={faRotateRight} /> Retry
                  </button>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="message bot" style={botMessageStyle}>
                <div className="message-content loading">
                  <div className="dot-typing"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form className="chat-input" style={{ backgroundColor: '#121212' }} onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder="Ask a cybersecurity question..."
              disabled={isLoading}
              style={{ backgroundColor: '#1e1e1e', color: 'white' }}
            />
            <button 
              type="submit" 
              disabled={isLoading || !inputText.trim()}
              style={{ backgroundColor: '#00ffcc', color: '#121212' }}
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chatbot; 