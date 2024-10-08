'use client'
import Image from "next/image";
import { useState } from "react";
import { Box, Stack, TextField, Button } from '@mui/material'
import { red } from "@mui/material/colors";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi, I am HeadstarterAI's support agent. How can I help you today?`
    }
  ]);
  const [message, setMessage] = useState('');

  const sendMessage = async() => {
    setMessage('')
    setMessages((messages)=>[
      ...messages,
      {
        role: 'user',
        content: message
      },

      {
        role: 'assistant',
        content: ""
      }

    ])
    const response = await fetch('/api/chat', {
      method: "POST",
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify([...messages, {role:"user", content: message, messages}]),
    });
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result ='';
    const processText = async({done,value}) => {
        if (done) {
          const jsonResponse = JSON.parse(result);
          let messageContent = jsonResponse.message;

          messageContent = messageContent.replace(/\*\*/g, '\n**');
          setMessages((messages) => {
            let lastMessage = messages[messages.length - 1];
            let otherMessages = messages.slice(0, messages.length - 1);
            return [
              ...otherMessages,
              {
                ...lastMessage,
                content: lastMessage.content + messageContent,
              },
            ];
          });
          return;
        }
        const text = decoder.decode(value || new Int8Array(), { stream: true });
        result += text;
        reader.read().then(processText);
      };
    
      reader.read().then(processText);
    }
    
  return <Box
    width="100vw"
    height="100vh"
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
  >
    <Stack
      direction="column"
      weight="600px"
      height="700px"
      border="lpx solid black"
      p={2}
      spacing={3}
    >
      <Stack
        direction="column"
        spacing={2}
        flexGrow={1}
        overflow="auto"
        maxheight="100%"
      >
        {
          messages.map((message, index) => (
            <Box
             key={index}
             display="flex"
             justifyContent={
              message.role === 'assistant' ? 'kkex-start' : 'flex-end'
            }


            >
              <Box
                bgcolor={
                  message.role === 'assistant'
                    ? 'primary.main'
                    : 'secondary.main'
                }
                color="white"
                borderRadius={16}
                p={3}
              >
                {message.content}
              </Box>
              
            </Box>

          ))}
        </Stack>
        <Stack
          direction="row" spacing={2}>
            <TextField
            label = "message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                sendMessage();
              }
            }}
            />
            <Button variant = "contained" onClick={sendMessage}>
              Send
            </Button>
          </Stack>

      </Stack>

    </Box>

}