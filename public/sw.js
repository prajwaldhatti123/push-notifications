self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : { title: 'Push Notification', body: 'You received a notification!' };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: 'https://via.placeholder.com/192x192.png?text=Icon' // Replace with your icon
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/') // Open the app when notification is clicked
  );
});