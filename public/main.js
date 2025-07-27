const publicVapidKey = 'BIDdKaVva69VLQsePdainTP2oLlWtoMe_--SgbWprGcDfAmA9ZIqfp1AuhUmT9KSsfcYVFj1gMn4u4oD7NLJMEI'; // Replace with your VAPID public key

// Convert a base64 string to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

// Register service worker and handle subscription
async function registerServiceWorker() {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      document.getElementById('status').textContent = 'Service Worker registration failed.';
    }
  } else {
    document.getElementById('status').textContent = 'Push notifications not supported.';
  }
}

// Check subscription status
async function checkSubscription(registration) {
  const subscription = await registration.pushManager.getSubscription();
  const subscribeBtn = document.getElementById('subscribeBtn');
  const unsubscribeBtn = document.getElementById('unsubscribeBtn');
  if (subscription) {
    subscribeBtn.disabled = true;
    unsubscribeBtn.disabled = false;
    document.getElementById('status').textContent = 'Subscribed to notifications.';
  } else {
    subscribeBtn.disabled = false;
    unsubscribeBtn.disabled = true;
    document.getElementById('status').textContent = 'Not subscribed.';
  }
  return subscription;
}

// Subscribe to push notifications
async function subscribe(registration) {
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });
    console.log('Subscribed:', subscription);
    // Send subscription to server
    await fetch('api/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: { 'Content-Type': 'application/json' }
    });
    document.getElementById('status').textContent = 'Subscribed successfully!';
    checkSubscription(registration);
  } catch (error) {
    console.error('Subscription failed:', error);
    document.getElementById('status').textContent = 'Subscription failed.';
  }
}

// Unsubscribe from push notifications
async function unsubscribe(registration) {
  try {
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
      // Notify server (optional)
      await fetch('api/unsubscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Unsubscribed');
      document.getElementById('status').textContent = 'Unsubscribed successfully!';
      checkSubscription(registration);
    }
  } catch (error) {
    console.error('Unsubscribe failed:', error);
    document.getElementById('status').textContent = 'Unsubscribe failed.';
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  const registration = await registerServiceWorker();
  if (registration) {
    await checkSubscription(registration);
    document.getElementById('subscribeBtn').addEventListener('click', () => subscribe(registration));
    document.getElementById('unsubscribeBtn').addEventListener('click', () => unsubscribe(registration));
  }
});