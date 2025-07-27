import { removeSubscription } from '../utils/pushStore';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const subscription = req.body;
  removeSubscription(subscription.endpoint);
  console.log('Subscription removed:', subscription);

  res.status(200).json({ message: 'Subscription removed' });
}
