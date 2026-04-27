import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In a real app, these should be in .env
const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY || "CHAPA_TEST_SECRET_KEY";
const CHAPA_API_URL = "https://api.chapa.co/v1";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Business API Strategy
  // For production, initialize firebase-admin with process.env.FIREBASE_SERVICE_ACCOUNT
  
  app.get("/api/v1/health", (req, res) => {
    res.json({ 
      status: "operational", 
      version: "1.0.4", 
      environment: process.env.NODE_ENV || "development",
      uptime: process.uptime()
    });
  });

  // GET /api/v1/events
  // Public directory for platform partners
  app.get("/api/v1/events", (req, res) => {
    // In a real database integration: return docs from collection 'events'
    res.json({
      success: true,
      count: 2,
      data: [
        {
          id: "EVT_9921",
          title: "NEON UNDERGROUND: TOKYO",
          dateTime: "2024-12-15T22:00:00Z",
          location: "Shibuya District",
          capacity: 500,
          category: "Music",
          status: "published"
        },
        {
          id: "EVT_8842",
          title: "QUANTUM WORKSHOP",
          dateTime: "2024-11-20T14:00:00Z",
          location: "Virtual Link",
          capacity: 100,
          category: "Education",
          status: "published"
        }
      ],
      meta: {
        lastUpdated: new Date().toISOString()
      }
    });
  });

  // Chapa Payment Initialization
  app.post("/api/v1/payments/initialize", async (req, res) => {
    try {
      const { 
        amount, 
        currency, 
        email, 
        first_name, 
        last_name, 
        tx_ref, 
        callback_url, 
        return_url,
        customization
      } = req.body;

      if (!process.env.CHAPA_SECRET_KEY) {
        console.warn("[CHAPA] No SECRET_KEY found in environment variables. Protocol will fail.");
      }

      const response = await axios.post(
        `${CHAPA_API_URL}/transaction/initialize`,
        {
          amount,
          currency,
          email,
          first_name,
          last_name,
          tx_ref,
          callback_url,
          return_url,
          customization
        },
        {
          headers: {
            Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      res.json(response.data);
    } catch (error: any) {
      const errorData = error.response?.data;
      console.error("[CHAPA ERROR]", JSON.stringify(errorData || error.message, null, 2));
      
      // Send the actual Chapa error back to the client if available
      if (errorData) {
        res.status(error.response.status).json({
          status: 'failed',
          message: errorData.message || 'Chapa initialization failed',
          details: errorData
        });
      } else {
        res.status(500).json({ status: 'failed', message: error.message || "Internal Server Error" });
      }
    }
  });

  // Chapa Payment Verification
  app.get("/api/v1/payments/verify/:tx_ref", async (req, res) => {
    try {
      const { tx_ref } = req.params;

      const response = await axios.get(
        `${CHAPA_API_URL}/transaction/verify/${tx_ref}`,
        {
          headers: {
            Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
          },
        }
      );

      res.json(response.data);
    } catch (error: any) {
      console.error("[CHAPA VERIFY ERROR]", error.response?.data || error.message);
      res.status(error.response?.status || 500).json(error.response?.data || { error: "Internal Server Error" });
    }
  });

  // POST /api/v1/validate
  // Server-side verification for security gates
  app.post("/api/v1/validate", (req, res) => {
    const { ticketId, signature } = req.body;

    if (!ticketId) {
      return res.status(400).json({ error: "MISSING_RESOURCE: Ticket identifier required." });
    }

    // Logic simulation: Validates if ID starts with 'TCK'
    const isValid = ticketId.startsWith("TCK");
    
    if (isValid) {
      res.json({
        valid: true,
        payload: {
          ticketId,
          entryTimestamp: new Date().toISOString(),
          accessLevel: "LEVEL_A",
          subjectStatus: "VERIFIED"
        }
      });
    } else {
      res.status(403).json({
        valid: false,
        error: "INVALID_PROTOCOL: Signature mismatch or expired asset."
      });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SYSTEM] Protocol engaged at http://localhost:${PORT}`);
  });
}

startServer();
