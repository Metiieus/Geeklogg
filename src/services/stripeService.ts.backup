import { auth } from '../firebase';

export async function startCheckout() {
  try {
    const user = auth.currentUser;
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid: user?.uid, email: user?.email }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('Checkout request failed', res.status, text);
      return;
    }

    let data: any = {};
    const raw = await res.text();
    if (raw) {
      try {
        data = JSON.parse(raw);
      } catch (e) {
        console.error('Invalid JSON response from checkout');
      }
    }

    if (data.url) {
      window.location.href = data.url;
    } else {
      console.error('Invalid Stripe session response');
    }
  } catch (err) {
    console.error('Failed to start checkout', err);
  }
}
