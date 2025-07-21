import http from "http";
import { MercadoPagoConfig, Preference } from "mercadopago";
import {
  initializeApp as initAdminApp,
  applicationDefault,
} from "firebase-admin/app";
import { getFirestore as getAdminFirestore } from "firebase-admin/firestore";

const mercadoPagoAccessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN || "APP_USR-5653582540014671-071813-702a1989c91d748fc96c2c61588137cd-182135011";
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

// Initialize MercadoPago
let mercadopago = null;
if (mercadoPagoAccessToken) {
  const client = new MercadoPagoConfig({ 
    accessToken: mercadoPagoAccessToken 
  });
  mercadopago = new Preference(client);
} else {
  console.error("MercadoPago access token missing");
}

// Initialize Firebase Admin
const adminApp = initAdminApp({ credential: applicationDefault() });
const adminDb = getAdminFirestore(adminApp);

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

async function createPreference(body, res) {
  if (!mercadopago) {
    res.writeHead(500, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    });
    return res.end(JSON.stringify({ error: "MercadoPago not configured" }));
  }

  try {
    const preference = {
      items: [
        {
          title: "GeekLog Premium",
          description: "Assinatura Premium do GeekLog",
          quantity: 1,
          currency_id: "BRL",
          unit_price: 19.99,
        },
      ],
      external_reference: body?.uid || "",
      payer: {
        email: body?.email || "",
      },
      back_urls: {
        success: `${clientUrl}/premium/success`,
        failure: `${clientUrl}/premium/failure`,
        pending: `${clientUrl}/premium/pending`,
      },
      auto_return: "approved",
      notification_url: `${process.env.SERVER_URL || 'http://localhost:4242'}/api/webhook`,
    };

    const response = await mercadopago.create({ body: preference });
    
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    });
    res.end(JSON.stringify({ 
      init_point: response.init_point,
      preference_id: response.id 
    }));
  } catch (err) {
    console.error("MercadoPago error", err);
    res.writeHead(500, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    });
    res.end(JSON.stringify({ error: "Failed to create preference" }));
  }
}

async function handleWebhook(req, res) {
  const chunks = [];
  req.on("data", (c) => chunks.push(c));
  req.on("end", async () => {
    try {
      const body = JSON.parse(Buffer.concat(chunks).toString());
      
      // MercadoPago webhook for payment notifications
      if (body.type === "payment") {
        const paymentId = body.data.id;
        
        // Here you would verify the payment with MercadoPago API
        // For now, we'll assume it's approved for testing
        if (body.action === "payment.created" || body.action === "payment.updated") {
          // Get payment details and update user
          // This is a simplified version - in production, verify payment status
          console.log("Payment notification received:", paymentId);
        }
      }
      
      res.writeHead(200);
      res.end("OK");
    } catch (error) {
      console.error("Webhook error:", error);
      res.writeHead(400);
      res.end("Bad Request");
    }
  });
}

async function updateUserPremium(req, res) {
  try {
    const body = await parseJson(req);
    const { uid, paymentId } = body;
    
    if (!uid) {
      res.writeHead(400, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      });
      return res.end(JSON.stringify({ error: "UID required" }));
    }

    await adminDb
      .collection("users")
      .doc(uid)
      .set(
        {
          plano: {
            status: "ativo",
            tipo: "premium",
            mercadoPagoPaymentId: paymentId,
            activatedAt: new Date(),
          },
        },
        { merge: true },
      );

    console.log("Premium activated for user:", uid);
    
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    });
    res.end(JSON.stringify({ success: true }));
  } catch (err) {
    console.error("Failed to update user premium:", err);
    res.writeHead(500, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    });
    res.end(JSON.stringify({ error: "Failed to update user" }));
  }
}

const server = http.createServer(async (req, res) => {
  // CORS headers for all requests
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (req.method === "OPTIONS") {
    res.writeHead(204, corsHeaders);
    return res.end();
  }

  if (req.url === "/api/create-preference" && req.method === "POST") {
    try {
      const body = await parseJson(req);
      return createPreference(body, res);
    } catch {
      res.writeHead(400, { 
        "Content-Type": "application/json",
        ...corsHeaders 
      });
      return res.end(JSON.stringify({ error: "Invalid JSON" }));
    }
  }

  if (req.url === "/api/webhook" && req.method === "POST") {
    return handleWebhook(req, res);
  }

  if (req.url === "/api/update-premium" && req.method === "POST") {
    return updateUserPremium(req, res);
  }

  // Health check
  if (req.url === "/health" && req.method === "GET") {
    res.writeHead(200, { 
      "Content-Type": "application/json",
      ...corsHeaders 
    });
    return res.end(JSON.stringify({ status: "OK" }));
  }

  res.writeHead(404, corsHeaders);
  res.end("Not Found");
});

const port = process.env.PORT || 4242;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`MercadoPago configured: ${!!mercadopago}`);
});
