'use client'
import React from 'react'
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Send } from 'lucide-react';
import { Message, useChat } from 'ai/react';
import MessagesList from './MessagesList';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

type Props = {chatId: number}
const Chat = ({chatId}: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ['chat', chatId],
    queryFn: async () => {
      const res = await axios.post<Message[]>('/api/get-messages', { chatId });
      return res.data;
    },
    enabled: !!chatId,
    refetchOnWindowFocus: false,
  });

  const { input, handleInputChange, messages, handleSubmit } = useChat({
    api: '/api/chat',
    body: {
      chatId
    },
    initialMessages: data || [],
  });

  React.useEffect(() => {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  return (
    <div className='relative max-h-screen overflow-hidden' id='chat-container'>
      <div className='sticky top-0 inset-x-0 p-2 bg-white h-fit'>
        <h3 className='text-xl font-bold'>Chat</h3>
      </div>
      <MessagesList messages={messages} isLoading={isLoading}/>
      <form onSubmit={handleSubmit} className='sticky botton-0 inset-x-0 px-2 py-4 bg-white'>
        <div className='flex'>
          <Input value={input} onChange={handleInputChange} placeholder='pregunta sobre el documento..' className='w-full'/>
          <Button className='bg-blue-500 ml-2' type='submit'>
            <Send className='h-4 w-4' />
          </Button>
        </div>
      </form>
    </div>
  )
}

export default Chat;
