import React, { useState } from 'react';
import './App.css'; // Add custom styles here

function App() {

  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm DishcoveryBOT! Ask me anything!",
      sender: "Grok",
    },
  ]);
  const [inputVal, setInputVal]=useState('')
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
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
      body: JSON.stringify({ messages: apiMessages }),
    })
      .then((response) => response.json())
      .then((data) => {
        const sanitizedMessage = data.reply.replace(/[#*]/g, '').trim();
        setMessages([
          ...chatMessages,
          {
            message: sanitizedMessage,
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
    <div className="chat-container">
      <div className="message-list">
        {messages.map((message, i) => (
          <div
            key={i}
            className={`message ${
              message.sender === 'user' ? 'user-message' : 'grok-message'
            }`}
          >
            {message.message}
          </div>
        ))}
        {isTyping && <div className="typing-indicator">Grok is typing...</div>}
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Type your message here"
          input={inputVal}
          onChange={(e) => setInputVal(e.target.value)} 
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target.value.trim() !== '') {
              handleSend(e.target.value);
              e.target.value = '';
            }
          }}
        />
        <button onClick={(e)=>{
          handleSend(inputVal)
        }} className='send-button'>

          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
      </svg>
      </button>
      </div>
    </div>
  );
}

export default App;





// import { useState } from 'react';
// import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
// import {
//   MainContainer,
//   ChatContainer,
//   MessageList,
//   Message,
//   MessageInput,
//   TypingIndicator,
// } from '@chatscope/chat-ui-kit-react';

// function App() {
//   const [messages, setMessages] = useState([
//     {
//       message: "Hello, I'm Grok! Ask me anything!",
//       sentTime: "just now",
//       sender: "Grok",
//     },
//   ]);
//   const [isTyping, setIsTyping] = useState(false);

//   const handleSend = async (message) => {
//     const newMessage = {
//       message,
//       direction: 'outgoing',
//       sender: 'user',
//     };

//     const newMessages = [...messages, newMessage];
//     setMessages(newMessages);

//     setIsTyping(true);
//     await processMessageToBackend(newMessages);
//   };

//   async function processMessageToBackend(chatMessages) {
//     const apiMessages = chatMessages.map((messageObject) => {
//       const role = messageObject.sender === 'Grok' ? 'assistant' : 'user';
//       return { role, content: messageObject.message };
//     });

//     await fetch('http://localhost:3000/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ messages: apiMessages }), // Send formatted messages
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         const sanitizedMessage=data.reply.replace(/[#*]/g,'').trim();
//         setMessages([
//           ...chatMessages,
//           {
//             message:sanitizedMessage,
//             sender: 'Grok',
//           },
//         ]);
//         setIsTyping(false);
//       })
//       .catch((error) => {
//         console.error('Error:', error);
//         setMessages([
//           ...chatMessages,
//           {
//             message: 'Error: Unable to fetch a response.',
//             sender: 'Grok',
//           },
//         ]);
//         setIsTyping(false);
//       });
//   }

//   return (
//     <div className="App">
//       <div style={{ position: 'relative', height: '800px', width: '700px' }}>
//         <MainContainer>
//           <ChatContainer>
//             <MessageList
//               scrollBehavior="smooth"
//               typingIndicator={
//                 isTyping ? <TypingIndicator content="Grok is typing" /> : null
//               }
//             >
//               {messages.map((message, i) => (
//                 <Message 
//                 key={i} 
//                 model={{
//                   message: message.message,
//                   sentTime: message.sentTime,
//                   sender: message.sender,
//                   direction: message.sender === "user" ? "outgoing" : "incoming", // Align based on sender
//                 }} />
//               ))}
//             </MessageList>
//             <MessageInput
//               placeholder="Type your message here"
//               onSend={(message) => handleSend(message)}
//             />
//           </ChatContainer>
//         </MainContainer>
//       </div>
//     </div>
//   );
// }

// export default App;


