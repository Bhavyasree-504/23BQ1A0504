import { useState } from 'react';

const NOTIFICATIONS_URL = 'http://4.224.186.213/evaluation-service/notifications';
const PRIORITY = { placement: 0, result: 1, event: 2 };
const TYPES = ['placement', 'result', 'event'];

const sortNotifications = (items) => [...items].sort((a, b) => {
  const diff = PRIORITY[a.type] - PRIORITY[b.type];
  return diff || new Date(b.timestamp) - new Date(a.timestamp);
});

const useNotify = () => {
  const [notification, setNotification] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');


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

};

export default useNotify;
