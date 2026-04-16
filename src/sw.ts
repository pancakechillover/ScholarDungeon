/// <reference lib="webworker" />
import { precacheAndRoute } from 'workbox-precaching';

declare let self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push Received.');
  
  if (event.data) {
    try {
      const data = event.data.json();
      console.log('[Service Worker] Push Data:', data);
      
      const options = {
        body: data.body || 'New update from Scholar\'s Dungeon',
        icon: '/pwa-icon.svg',
        badge: '/pwa-icon.svg',
        vibrate: [100, 50, 100],
        data: data.data,
        tag: 'dungeon-notification', // Group notifications
        renotify: true,
        actions: [
          { action: 'open', title: 'Return to Dungeon' }
        ]
      };

      event.waitUntil(
        self.registration.showNotification(data.title || 'Dungeon Alert', options)
          .then(() => console.log('[Service Worker] Notification shown.'))
          .catch(err => console.error('[Service Worker] Failed to show notification:', err))
      );
    } catch (e) {
      console.error('[Service Worker] Error parsing push data:', e);
      // Fallback for non-JSON data
      const text = event.data.text();
      event.waitUntil(
        self.registration.showNotification('Dungeon Alert', { body: text })
      );
    }
  } else {
    console.warn('[Service Worker] Push event but no data.');
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }
    })
  );
});
