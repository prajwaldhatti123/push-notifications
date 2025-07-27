const webPush = require('web-push');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// In-memory subscription store (use a database in production)
let subscriptions = [];

// VAPID keys (generate once and reuse)
const vapidKeys = {
  publicKey: 'BIDdKaVva69VLQsePdainTP2oLlWtoMe_--SgbWprGcDfAmA9ZIqfp1AuhUmT9KSsfcYVFj1gMn4u4oD7NLJMEI', // Replace with your VAPID public key
  privateKey: 'YrLqwL28dNqLtoK-BRFBJHRD0APFHrwFz0eSDCrV6O0' // Replace with your VAPID private key
};

webPush.setVapidDetails(
  'mailto:your-email@example.com', // Replace with your email
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Subscribe endpoint
app.post('subscribe', (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  console.log('Subscription added:', subscription);
  res.status(201).json({ message: 'Subscription added' });
});

// Unsubscribe endpoint
app.post('unsubscribe', (req, res) => {
  const subscription = req.body;
  subscriptions = subscriptions.filter(sub => sub.endpoint !== subscription.endpoint);
  console.log('Subscription removed:', subscription);
  res.status(200).json({ message: 'Subscription removed' });
});

// Send notification endpoint
app.post('send-notification', async (req, res) => {
  const { title, body } = req.body;
  const payload = JSON.stringify({ title, body });

  try {
    for (const subscription of subscriptions) {
      await webPush.sendNotification(subscription, payload);
    }
    res.status(200).json({ message: 'Notifications sent' });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Failed to send notifications' });
  }
});

app.get('health' , async (req , res)=>{
    res.json("Heart beat from server")
    try {
        res.status(200).json({ message: 'Heart beat from server' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send beat' });
    }
})

module.exports = app;