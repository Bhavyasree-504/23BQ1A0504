import { useState } from 'react';

const NOTIFICATIONS_URL = 'http://4.224.186.213/evaluation-service/notifications';
const PRIORITY = { placement: 0, result: 1, event: 2 };
const TYPES = ['placement', 'result', 'event'];


export const generateRandomNotifications = (count = 10) => {
  

  return Array.from({ length: count }, (_, index) => {
    const type = random(TYPES);
    const message = random(TEMPLATES[type])
    return {
      id: `rand-${Date.now()}-${index}`,
      type,
      message,
      timestamp: formatTimestamp(Date.now() - Math.floor(Math.random() * 10) * 86400000),
    };
  });
};

const sortNotifications = (items) => [...items].sort((a, b) => {
  const diff = PRIORITY[a.type] - PRIORITY[b.type];
  return diff || new Date(b.timestamp) - new Date(a.timestamp);
});

const useNotify = () => {
  const [notification, setNotification] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const notify = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const checkNotifications = async () => {
    setLoading(true);
    setNotifications([]);
   
    notify('Fetching notifications...', 'info');

    try {
      const res = await fetch(NOTIFICATIONS_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const items = Array.isArray(data) ? data.map(normalize) : [];
      const top = items.length > 0
        ? sortNotifications(items).slice(0, 10)
        : getFallback();

      const message = items.length > 0
        ? `Showing top ${top.length} notifications.`
        : 'No notifications found. Showing default notifications.';

      setStatus(message);
      notify(message, items.length > 0 ? 'success' : 'info');
      setNotifications(top);
    } catch (error) {
     
     
      setNotifications(getFallback());
    } finally {
      setLoading(false);
    }
  };

  return { notification, notifications, loading, status, checkNotifications };
};

export default useNotify;
