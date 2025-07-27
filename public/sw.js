self.addEventListener('push', event => {
console.log('Push event received:', event.data ? event.data.json() : 'No data');
const data = event.data ? event.data.json() : { title: 'Push Notification', body: 'You received a notification!' };
event.waitUntil(
    self.registration.showNotification(data.title, {
    body: data.body,
    icon: 'https://via.placeholder.com/192x192.png?text=Icon'
    }).catch(error => {
    console.error('Error showing notification:', error);
    })
);
});

self.addEventListener('notificationclick', event => {
console.log('Notification clicked:', event.notification);
event.notification.close();
event.waitUntil(
    clients.openWindow('/')
);
});