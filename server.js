import http from "http";
import { URLSearchParams } from "url";
import {
  initializeApp as initAdminApp,
  applicationDefault,
} from "firebase-admin/app";
import { getFirestore as getAdminFirestore } from "firebase-admin/firestore";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const priceId = process.env.STRIPE_PRICE_ID;
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Initialize Firebase Admin for webhook updates
const adminApp = initAdminApp({ credential: applicationDefault() });
const adminDb = getAdminFirestore(adminApp);

if (!stripeSecret || !priceId) {
  console.error("Stripe environment variables missing");
}

function parseJson(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(data || "{}"));
      } catch (err) {
        reject(err);
      }
    });
  });
}

async function createCheckoutSession(body, res) {
  const params = new URLSearchParams({
    mode: "subscription",
    "payment_method_types[]": "card",
    success_url: `${clientUrl}/premium/success`,
    cancel_url: `${clientUrl}/premium/cancel`,
    "line_items[0][price]": priceId,
    "line_items[0][quantity]": "1",
  });

  if (body?.uid) params.append("client_reference_id", body.uid);
  if (body?.email) params.append("customer_email", body.email);

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

function handleWebhook(req, res) {
  const chunks = [];
  req.on("data", (c) => chunks.push(c));
  req.on("end", async () => {
    const raw = Buffer.concat(chunks).toString();
    let event;
    try {
      event = JSON.parse(raw);
    } catch (e) {
      res.writeHead(400);
      return res.end();
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const uid = session.client_reference_id;
      try {
        await adminDb
          .collection("users")
          .doc(uid)
          .set(
            {
              plano: {
                status: "ativo",
                tipo: "premium",
                stripeId: session.subscription,
              },
            },
            { merge: true },
          );
        console.log("Subscription active for", uid);
      } catch (err) {
        console.error("Failed to update subscription for", uid, err);
      }
    }

    res.writeHead(200);
    res.end();
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": clientUrl,
      "Access-Control-Allow-Methods": "POST,GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    return res.end();
  }

  if (req.url === "/api/checkout" && req.method === "POST") {
    try {
      const body = await parseJson(req);
      return createCheckoutSession(body, res);
    } catch {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Invalid JSON" }));
    }
  }

  if (req.url === "/api/webhook" && req.method === "POST") {
    return handleWebhook(req, res);
  }

  res.writeHead(404);
  res.end();
});

const port = process.env.PORT || 4242;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
