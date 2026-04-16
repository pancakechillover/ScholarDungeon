/// <reference lib="webworker" />
import { precacheAndRoute } from 'workbox-precaching';

declare let self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing version: 1.6.3');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  console.log('[Service Worker v1.6.3] Push Received.');
  
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
  console.log('[Service Worker] Notification Clicked:', event.action);
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return self.clients.openWindow('/');
    })
  );
});

self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message Received:', event.data);
  if (event.data && event.data.type === 'TEST_NOTIFICATION_SW') {
    self.registration.showNotification('Scholar\'s Dungeon', {
      body: 'Service Worker thread notification test successful!',
      icon: '/pwa-icon.svg',
      tag: 'test-thread'
    });
  }
});
