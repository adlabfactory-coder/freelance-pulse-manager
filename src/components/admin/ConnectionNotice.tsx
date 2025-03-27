
import React from 'react';

interface ConnectionNoticeProps {
  isSupabaseConnected: boolean;
}

const ConnectionNotice: React.FC<ConnectionNoticeProps> = ({ isSupabaseConnected }) => {
  if (isSupabaseConnected) return null;
  
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <p className="font-medium text-yellow-800">Mode démo</p>
      <p className="text-yellow-700">La connexion à Supabase n'est pas configurée. Les données affichées sont fictives.</p>
    </div>
  );
};

export default ConnectionNotice;
