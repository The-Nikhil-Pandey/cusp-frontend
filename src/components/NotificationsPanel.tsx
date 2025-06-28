
import React from 'react';
import { Badge } from '@/components/ui/badge';

const NotificationsPanel = () => {
  const notifications = [
    { id: 1, type: 'like', message: 'Sarah liked your post', time: '2 min ago', unread: true },
    { id: 2, type: 'comment', message: 'Mike commented on your post', time: '1 hour ago', unread: true },
    { id: 3, type: 'follow', message: 'Emma started following you', time: '3 hours ago', unread: false }
  ];

  return (
    <div className="space-y-4 p-4">
      {notifications.map((notification) => (
        <div key={notification.id} className={`p-3 rounded-lg border ${
          notification.unread ? 'bg-accent/50' : 'bg-background'
        }`}>
          <div className="flex justify-between items-start">
            <p className="text-sm">{notification.message}</p>
            {notification.unread && (
              <Badge variant="secondary" className="ml-2">New</Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
        </div>
      ))}
    </div>
  );
};

export default NotificationsPanel;
