import { auth } from '../firebase';

export async function startCheckout() {
  try {
    const user = auth.currentUser;
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid: user?.uid, email: user?.email }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      console.error('Invalid Stripe session response');
    }
  } catch (err) {
    console.error('Failed to start checkout', err);
  }
}
