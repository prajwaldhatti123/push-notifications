import webPush from 'web-push';
import { subscriptions } from '../utils/pushStore';

const vapidKeys = {
  publicKey: 'BIDdKaVva69VLQsePdainTP2oLlWtoMe_--SgbWprGcDfAmA9ZIqfp1AuhUmT9KSsfcYVFj1gMn4u4oD7NLJMEI',
  privateKey: 'YrLqwL28dNqLtoK-BRFBJHRD0APFHrwFz0eSDCrV6O0'
};

webPush.setVapidDetails(
  'mailto:your-email@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { subscription } = req.body;
  const payload = JSON.stringify({ title : "title", body : "testing notification" });

  try {
    // for (const subscription of subscriptions) {
    //     console.log('Sending notification to:', subscription.endpoint);
    //   await webPush.sendNotification(subscription, payload);
    // }
    await webPush.sendNotification(subscription, payload);
    res.status(200).json({ message: 'Notifications sent' });
  } catch (error) {
    console.error('Notification error:', error);
    res.status(500).json({ error: 'Failed to send notifications' });
  }
}
