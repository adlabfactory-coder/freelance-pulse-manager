
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserAvatarProps {
  name: string;
  avatarUrl?: string;
  className?: string;
}

/**
 * UserAvatar component displays either a user's avatar image or initials in a fallback
 */
const UserAvatar: React.FC<UserAvatarProps> = ({ name, avatarUrl, className }) => {
  // Generate initials from user name
  const getInitials = (name: string) => {
    if (!name) return '?';
    
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <Avatar className={className}>
      {avatarUrl ? (
        <AvatarImage src={avatarUrl} alt={name} />
      ) : null}
      <AvatarFallback>
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
