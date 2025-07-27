self.addEventListener('push', event => {
  let data = { title: 'Push Notification', body: 'You received a notification!' };

  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (err) {
    console.error('Error parsing push data:', err);
  }

  console.log('Push event received:', data);

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: 'https://via.placeholder.com/192x192.png?text=Icon'
    })
  );
});

self.addEventListener('notificationclick', event => {
  console.log('Notification clicked:', event.notification);
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
