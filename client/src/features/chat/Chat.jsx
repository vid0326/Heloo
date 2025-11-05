import React from 'react'
import ChatContainer from './components/chat-container/ChatContainer'
import Contacts from './components/contacts-container/Contacts'
import EmptyChat from './components/empty-chat-container/EmptyChat'
import { selectChatType } from './chatSlice'
import { useSelector } from 'react-redux'

const Chat = () => {
  const chatType = useSelector(selectChatType);

  return (
    <div className="flex h-[100svh] overflow-hidden text-white">
      <Contacts />
      {chatType ? <ChatContainer /> : <EmptyChat />}
    </div>
  )
}

export default Chat
