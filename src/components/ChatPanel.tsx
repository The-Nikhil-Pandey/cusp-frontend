
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const ChatPanel = () => {
  const chats = [
    { id: 1, name: 'Sarah Johnson', lastMessage: 'Thanks for the advice!', time: '2 min ago' },
    { id: 2, name: 'Community Chat', lastMessage: 'New guidelines posted', time: '1 hour ago' },
    { id: 3, name: 'Mike Chen', lastMessage: 'See you at the event', time: '3 hours ago' }
  ];

  return (
    <div className="space-y-4 p-4">
      {chats.map((chat) => (
        <div key={chat.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent cursor-pointer">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{chat.name}</p>
            <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
          </div>
          <span className="text-xs text-muted-foreground">{chat.time}</span>
        </div>
      ))}
    </div>
  );
};

export default ChatPanel;
