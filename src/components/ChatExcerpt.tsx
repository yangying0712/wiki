import React from 'react';

interface Message {
  sender: string;
  content: string;
  isMe?: boolean;
  avatar?: string;
  color?: string;
  timestamp?: string;
}

interface ChatBubbleProps {
  message: Message;
  className?: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, className = '' }) => {
  const { sender, content, isMe = false, avatar, color, timestamp } = message;
  
  return (
    <div
      className={`
        flex items-end gap-2 mb-4
        ${isMe ? 'flex-row-reverse' : 'flex-row'}
        ${className}
      `}
    >
      {/* 头像 */}
      <div
        className="
          w-8 h-8 rounded-full flex-shrink-0
          flex items-center justify-center
          text-white text-sm font-bold
        "
        style={{ backgroundColor: color || (isMe ? '#4f46e5' : '#6b7280') }}
      >
        {avatar ? (
          <img src={avatar} alt={sender} className="w-full h-full rounded-full object-cover" />
        ) : (
          sender.charAt(0).toUpperCase()
        )}
      </div>
      
      {/* 消息内容 */}
      <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* 发送者名称 */}
        <span
          className="text-xs mb-1 px-1"
          style={{ color: color || 'var(--color-muted)' }}
        >
          {sender}
        </span>
        
        {/* 气泡 */}
        <div
          className={`
            px-4 py-2 max-w-full break-words
            ${isMe 
              ? 'bg-indigo-500 text-white rounded-t-2xl rounded-bl-2xl rounded-br-sm' 
              : 'bg-gray-100 dark:bg-gray-800 text-[var(--color-text)] rounded-t-2xl rounded-br-2xl rounded-bl-sm'
            }
          `}
          style={isMe && color ? { backgroundColor: color } : undefined}
        >
          {content}
        </div>
        
        {/* 时间戳 */}
        {timestamp && (
          <span className="text-xs text-[var(--color-muted)] mt-1 px-1">
            {timestamp}
          </span>
        )}
      </div>
    </div>
  );
};

// 聊天对话组件
interface ChatExcerptProps {
  messages: Message[];
  title?: string;
  className?: string;
}

export const ChatExcerpt: React.FC<ChatExcerptProps> = ({
  messages,
  title,
  className = '',
}) => {
  return (
    <div
      className={`
        my-6 rounded-xl border border-[var(--color-border)]
        bg-[var(--color-card)] overflow-hidden
        ${className}
      `}
    >
      {/* 标题栏 - 模拟聊天应用 */}
      {title && (
        <div className="px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-background)]">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-400"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
              <span className="w-3 h-3 rounded-full bg-green-400"></span>
            </div>
            <span className="ml-2 text-sm font-medium">{title}</span>
          </div>
        </div>
      )}
      
      {/* 消息列表 */}
      <div className="p-4">
        {messages.map((msg, index) => (
          <ChatBubble key={index} message={msg} />
        ))}
      </div>
    </div>
  );
};

export default ChatExcerpt;
