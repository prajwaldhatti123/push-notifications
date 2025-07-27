import { addSubscription } from '../utils/pushStore';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const subscription = req.body;
  addSubscription(subscription);
  console.log('Subscription added:', subscription);

  res.status(201).json({ message: 'Subscription added' });
}
