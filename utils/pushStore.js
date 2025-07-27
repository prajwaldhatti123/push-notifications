export const subscriptions = [];

export const addSubscription = (sub) => {
  subscriptions.push(sub);
};

export const removeSubscription = (endpoint) => {
  const index = subscriptions.findIndex(s => s.endpoint === endpoint);
  if (index > -1) subscriptions.splice(index, 1);
};
