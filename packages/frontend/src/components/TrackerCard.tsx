import React from 'react';

export interface Tracker {
  id: number;
  keyword: string;
  lastSeen: string;
  count: number;
  type: 'post' | 'comment' | 'all';
  notifications: ('slack' | 'email')[];
}

interface TrackerCardProps {
  tracker: Tracker;
}

const TrackerCard: React.FC<TrackerCardProps> = ({ tracker }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center">
      <div>
        <h2 className="text-xl font-bold text-orange-500">{tracker.keyword}</h2>
        <p className="text-gray-400">Last seen: {tracker.lastSeen}</p>
        <p className="text-gray-400">Count: {tracker.count}</p>
        <p className="text-gray-400">Type: {tracker.type}</p>
        <p className="text-gray-400">Notifications: {tracker.notifications.join(', ')}</p>
      </div>
      <div className="relative">
        <button className="text-gray-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
        {/* Context menu will be implemented later */}
      </div>
    </div>
  );
};

export default TrackerCard;
