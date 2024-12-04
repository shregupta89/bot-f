import { useState } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from '@chatscope/chat-ui-kit-react';

function App() {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm Grok! Ask me anything!",
      sentTime: "just now",
      sender: "Grok",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: 'user',
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);

    setIsTyping(true);
    await processMessageToBackend(newMessages);
  };

  async function processMessageToBackend(chatMessages) {
    const apiMessages = chatMessages.map((messageObject) => {
      const role = messageObject.sender === 'Grok' ? 'assistant' : 'user';
      return { role, content: messageObject.message };
    });

    await fetch('http://localhost:3000/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages: apiMessages }), // Send formatted messages
    })
      .then((response) => response.json())
      .then((data) => {
        setMessages([
          ...chatMessages,
          {
            message: data.reply,
            sender: 'Grok',
          },
        ]);
        setIsTyping(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setMessages([
          ...chatMessages,
          {
            message: 'Error: Unable to fetch a response.',
            sender: 'Grok',
          },
        ]);
        setIsTyping(false);
      });
  }

  return (
    <div className="App">
      <div style={{ position: 'relative', height: '800px', width: '700px' }}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={
                isTyping ? <TypingIndicator content="Grok is typing" /> : null
              }
            >
              {messages.map((message, i) => (
                <Message key={i} model={message} />
              ))}
            </MessageList>
            <MessageInput
              placeholder="Type your message here"
              onSend={(message) => handleSend(message)}
            />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default App;



// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
   
//     </>
//   )
// }

// export default App
