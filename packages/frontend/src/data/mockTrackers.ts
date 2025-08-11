import { Tracker } from '../components/TrackerCard';

export const mockTrackers: Tracker[] = [
  {
    id: 1,
    keyword: 'React',
    lastSeen: '2024-08-10 14:00',
    count: 12,
    type: 'all',
    notifications: ['email', 'slack'],
  },
  {
    id: 2,
    keyword: 'Vue.js',
    lastSeen: '2024-08-10 12:30',
    count: 5,
    type: 'post',
    notifications: ['email'],
  },
  {
    id: 3,
    keyword: 'Svelte',
    lastSeen: '2024-08-09 18:00',
    count: 8,
    type: 'comment',
    notifications: ['slack'],
  },
];
