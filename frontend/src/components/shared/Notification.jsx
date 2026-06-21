import React, { useEffect, useState, useRef } from 'react';
import axiosClient from '../../api/axiosClient';
import AfCard from '../ui/AfCard';
import FadeIn from '../ui/FadeIn';
import AfButton from '../ui/AfButton';

// Notification component: polling-based, optimistic updates, accessible, animated
export default function Notification({ pollingInterval = 30000, initial = [] }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(initial);
  const [isLoading, setIsLoading] = useState(false);
  const mounted = useRef(true);
  const pollRef = useRef(null);

  useEffect(() => {
    mounted.current = true;
    fetchNotifications();
    pollRef.current = setInterval(fetchNotifications, pollingInterval);
    return () => {
      mounted.current = false;
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [pollingInterval]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await axiosClient.get('/notifications');
      // Expect backend to return { data: [...] }
      const items = (res.data && res.data.data) || [];
      if (mounted.current) setNotifications(items);
    } catch (err) {
      // No-op: keep local state (component supports initial prop)
      // console.debug('Notifications fetch failed', err?.message);
    } finally {
      if (mounted.current) setIsLoading(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleOpen = () => setOpen(v => !v);

  const markAsRead = async (id) => {
    // optimistic update
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    try {
      await axiosClient.put(`/notifications/${id}/read`);
    } catch (err) {
      // revert on failure
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: false } : n));
    }
  };

  const dismissNotification = async (id) => {
    // optimistic removal
    const previous = notifications;
    setNotifications(prev => prev.filter(n => n.id !== id));
    try {
      await axiosClient.delete(`/notifications/${id}`);
    } catch (err) {
      // revert
      setNotifications(previous);
    }
  };

  const markAllRead = async () => {
    const previous = notifications;
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      await axiosClient.put('/notifications/mark-all-read');
    } catch (err) {
      setNotifications(previous);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        aria-haspopup="true"
        aria-expanded={open}
        onClick={toggleOpen}
        className={`af-btn hover-lift ${open ? 'af-btn-primary' : 'af-btn-outline'}`}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
        title="Notifications"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h11z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9.719 19a2.5 2.5 0 004.562 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {unreadCount > 0 && (
          <span className="af-status-pill" style={{ fontSize: 12, padding: '4px 8px' }} aria-live="polite">{unreadCount}</span>
        )}
      </button>

      {open && (
        <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: 360, zIndex: 60 }}>
          <AfCard className="slide-in-down" style={{ padding: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div>
                <strong>Notifications</strong>
                <div className="af-muted" style={{ fontSize: 12 }}>{isLoading ? 'Refreshing...' : `${notifications.length} total`}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <AfButton variant="ghost" onClick={markAllRead} className="af-btn-small">Mark all read</AfButton>
                <AfButton variant="ghost" onClick={() => setOpen(false)} className="af-btn-small">Close</AfButton>
              </div>
            </div>

            <div style={{ maxHeight: 360, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {notifications.length === 0 && (
                <div className="af-muted" style={{ padding: '18px 8px', textAlign: 'center' }}>No notifications</div>
              )}

              {notifications.map((note) => (
                <FadeIn key={note.id} className={`af-card-grid`} delay={80}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: 8, borderRadius: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ fontWeight: 700 }}>{note.title}</div>
                        <div className="af-muted" style={{ fontSize: 12 }}>{new Date(note.timestamp || note.createdAt || Date.now()).toLocaleString()}</div>
                      </div>
                      <div className="af-muted" style={{ marginTop: 6, fontSize: 13 }}>{note.message || note.body || ''}</div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                      {!note.read && (
                        <AfButton variant="primary" onClick={() => markAsRead(note.id)} className="af-btn-small">Mark read</AfButton>
                      )}
                      <AfButton variant="ghost" onClick={() => dismissNotification(note.id)} className="af-btn-small">Dismiss</AfButton>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>

          </AfCard>
        </div>
      )}
    </div>
  );
}
