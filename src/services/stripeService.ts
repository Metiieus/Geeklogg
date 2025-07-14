export async function startCheckout() {
  try {
    const res = await fetch('/create-checkout-session', { method: 'POST' });
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
