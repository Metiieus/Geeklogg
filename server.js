import http from "http";
import { URLSearchParams } from "url";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const priceId = process.env.STRIPE_PRICE_ID;
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

if (!stripeSecret || !priceId) {
  console.error("Stripe environment variables missing");
}

async function createSession(res) {
  const params = new URLSearchParams({
    mode: "payment",
    success_url: `${clientUrl}/premium/success`,
    cancel_url: `${clientUrl}/premium/cancel`,
    "line_items[0][price]": priceId,
    "line_items[0][quantity]": "1",
  });
  try {
    const response = await fetch(
      "https://api.stripe.com/v1/checkout/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${stripeSecret}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      },
    );
    const data = await response.json();
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": clientUrl,
    });
    res.end(JSON.stringify({ url: data.url }));
  } catch (err) {
    console.error("Stripe error", err);
    res.writeHead(500, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": clientUrl,
    });
    res.end(JSON.stringify({ error: "Failed to create session" }));
  }
}

const server = http.createServer((req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": clientUrl,
      "Access-Control-Allow-Methods": "POST,GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  if (req.url === "/create-checkout-session" && req.method === "POST") {
    return createSession(res);
  }
  res.writeHead(404);
  res.end();
});

const port = process.env.PORT || 4242;
server.listen(port, () => {
  console.log(`Stripe server running on port ${port}`);
});
