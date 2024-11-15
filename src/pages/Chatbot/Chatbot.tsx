import React, { useState } from 'react';
import './Chatbot.css';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import axiosInstance from '../../utils/axiosInstance';
import chatIcon from '../../assets/icons/chat.svg';
import sendIcon from '../../assets/icons/row.svg';
import botIcon from '../../assets/icons/bot-icon.svg';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    if (messages.length === 0) {
      setMessages([{
        sender: 'bot',
        text: '¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setMessages([]);
    setUserInput('');
  };

  const handleSendMessage = async () => {
    if (userInput.trim() === '') return;

    const newMessages: Message[] = [
      ...messages,
      { sender: 'user', text: userInput, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ];
    setMessages(newMessages);
    setUserInput('');

    try {
      const response = await axiosInstance.post('/search-issues', { query: userInput });
      console.log(response.data[0].solucion);
      setMessages([
        ...newMessages,
        { sender: 'bot', text: response.data[0].solucion, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages([
        ...newMessages,
        { sender: 'bot', text: 'Lo siento, hubo un error.', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      <button onClick={handleOpen} className="chatbot-toggle">
        <img src={chatIcon} alt="Chat Icon" /> Chat en línea
      </button>

      <Dialog open={open} PaperProps={{ className: 'chatbot-dialog' }} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Asistente Virtual</DialogTitle>

        <DialogContent dividers className="chatbot-messages">
          {messages.map((message, index) => (
            <div key={index} className="message-container">
              {message.sender === 'bot' && (
                <div className="bot-header">
                  <img src={botIcon} alt="Bot Icon" className="bot-icon" />
                  <span className="bot-name">Asistente</span>
                </div>
              )}
              <div className={`message ${message.sender}`}>
                {message.text}
              </div>
              <span className={`timestamp ${message.sender}`}>{message.timestamp}</span>
            </div>
          ))}
        </DialogContent>

        <DialogActions style={{ padding: '10px' }}>
          <TextField
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Preguntar..."
            fullWidth
            variant="standard"
            InputProps={{ disableUnderline: true }}
            className='chatbot-input'
          />
          <button onClick={handleSendMessage} className="button-chat">
            <img src={sendIcon} alt="Send Icon" />
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Chatbot;
