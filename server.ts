import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import crypto from 'crypto';
import cors from 'cors';
import { aesCmac } from 'node-aes-cmac';
import { createServer as createViteServer } from 'vite';
import { rateLimit } from 'express-rate-limit';

// Firebase Client SDK
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import fs from 'fs';

dotenv.config();

// 1. Initialize Firebase from config
const firebaseConfigPath = path.join(process.cwd(), 'firebase-applet-config.json');
let db: any = null;
if (fs.existsSync(firebaseConfigPath)) {
  const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, 'utf-8'));
  const firebaseApp = initializeApp(firebaseConfig);
  db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
} else {
  console.error("WARNING: firebase-applet-config.json not found. Database features will not work.");
}

// NTAG Verification Keys & API Key
const KEY_01_HEX = process.env.NTAG_KEY_01 || "00000000000000000000000000000000"; // Meta Read Key (PICC Decrypt)
const KEY_02_HEX = process.env.NTAG_KEY_02 || "00000000000000000000000000000000"; // SDM File Read Key (CMAC)
const APEX_API_KEY = process.env.APEX_API_KEY || "your_secure_api_key_here";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 5. CORS configuration: Allow specific domains, but allow all for the provision app/verification
  app.use(cors({
    origin: (origin, callback) => {
      // In a real production environment, replace with your exact allowed domains:
      // const allowedOrigins = ['https://apexhpstore.com', 'https://verify.apexhpstore.com', 'http://localhost:3000'];
      // For now, we allow all origins to support the Android App without issues, but you can tighten this later.
      callback(null, true);
    }
  }));
  
  app.use(express.json({ limit: '10mb' }));

  // 5. Rate Limiting for Verification (Prevent Brute-Force Attacks)
  const verifyLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    limit: 30, // Limit each IP to 30 requests per minute
    message: { success: false, error: "Too many verification requests from this IP, please try again after a minute." }
  });

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // 1. NTAG Provisioning Endpoint (For Android App)
  app.post('/api/provision', async (req, res) => {
    // 1a. API Key Check (Authorization: Bearer <KEY>)
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${APEX_API_KEY}`) {
      return res.status(401).json({ success: false, error: "Unauthorized: Invalid or missing API Key" });
    }

    const { uid, initialCounter, invoiceNo, customerName, customerPhone, address } = req.body;
    
    if (!uid) {
      return res.status(400).json({ success: false, error: "UID is required" });
    }

    if (!db) {
      return res.status(500).json({ success: false, error: "Database not configured" });
    }

    try {
      // 1b. Database Record Storage
      const counterValue = initialCounter || 0;
      
      const tagData: any = {
        counter: counterValue,
        updatedAt: new Date().toISOString()
      };
      
      if (invoiceNo) tagData.invoiceNo = invoiceNo;
      if (customerName) tagData.customerName = customerName;
      if (customerPhone) tagData.customerPhone = customerPhone;
      if (address) tagData.address = address;

      await setDoc(doc(db, "ntag_counters", uid), tagData, { merge: true });
      
      return res.json({ 
        success: true, 
        message: "Tag provisioned successfully",
        data: { uid, counter: counterValue }
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Customer Self-Update Endpoint
  app.post('/api/customer/update', async (req, res) => {
    const { uid, invoiceNo, updatedData } = req.body;
    
    if (!uid || !invoiceNo || !updatedData) {
      return res.status(400).json({ success: false, error: "Missing required fields." });
    }

    if (!db) {
      return res.status(500).json({ success: false, error: "Database not configured" });
    }

    try {
      const counterDoc = await getDoc(doc(db, "ntag_counters", uid));
      if (!counterDoc.exists()) {
        return res.status(404).json({ success: false, error: "Tag not found." });
      }

      const tagData = counterDoc.data();
      if (!tagData.invoiceNo || tagData.invoiceNo.toString().trim() !== invoiceNo.toString().trim()) {
        return res.status(403).json({ success: false, error: "Invalid Invoice Number verification failed." });
      }

      // Update allowed
      const { customerName, customerPhone, address } = updatedData;
      await setDoc(doc(db, "ntag_counters", uid), {
        customerName: customerName || tagData.customerName || "",
        customerPhone: customerPhone || tagData.customerPhone || "",
        address: address || tagData.address || "",
        updatedAt: new Date().toISOString()
      }, { merge: true });

      return res.json({ success: true, message: "Customer information updated successfully." });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // 2. NTAG Verification Endpoint
  app.get('/api/verify', verifyLimiter, async (req, res) => {
    const piccDataHex = req.query.picc_data as string;
    const receivedCmacHex = req.query.cmac as string;

    if (!piccDataHex || !receivedCmacHex) {
      return res.status(400).json({ success: false, error: "Missing parameters" });
    }

    try {
      const key01 = Buffer.from(KEY_01_HEX, "hex");
      const key02 = Buffer.from(KEY_02_HEX, "hex");
      const piccCiphertext = Buffer.from(piccDataHex, "hex");

      if (piccCiphertext.length !== 16) {
        return res.status(400).json({ success: false, error: "Invalid PICC length" });
      }

      // 2a. PICC Data Decryption (AES-128-CBC)
      const decipher = crypto.createDecipheriv("aes-128-cbc", key01, Buffer.alloc(16, 0));
      decipher.setAutoPadding(false);
      const decryptedPicc = Buffer.concat([decipher.update(piccCiphertext), decipher.final()]);

      // Format: 0xC7 (1B) + UID (7B) + ReadCounter (3B little-endian) + Padding (5B)
      const uid = decryptedPicc.subarray(1, 8).toString("hex").toUpperCase();
      const readCounter = decryptedPicc.readUIntLE(8, 3);

      // 3. Anti-Replay Counter Check (Database)
      let tagData: any = {};
      if (db) {
        const counterDoc = await getDoc(doc(db, "ntag_counters", uid));
        tagData = counterDoc.exists() ? counterDoc.data() : {};
        const lastCounter = tagData.counter !== undefined ? tagData.counter : -1;
        
        // The read counter must be STRICTLY GREATER THAN the stored counter
        if (readCounter <= lastCounter) {
          return res.status(403).json({
            success: false,
            error: "Replay detected. ဤလင့်ခ်ကို ယခင်က အသုံးပြုပြီးဖြစ်သည် သို့မဟုတ် ကော်ပီလင့်ခ်ဖြစ်နေပါသည်။",
            uid,
            readCounter
          });
        }
      }

      // 2b. Session Key Derivation (SV)
      const sv = Buffer.alloc(16, 0);
      sv[0] = 0x5a;
      sv[1] = 0xa5;
      sv[2] = 0x00;
      sv[3] = 0x01;
      sv[4] = 0x00;
      sv[5] = 0x80;
      sv.writeUIntLE(readCounter, 6, 3);

      const cipher = crypto.createCipheriv("aes-128-ecb", key02, null);
      cipher.setAutoPadding(false);
      const sesAuthKey = Buffer.concat([cipher.update(sv), cipher.final()]);

      // 2c. AES-CMAC and 8-byte Truncation (Using Empty Buffer for MAC Input)
      const fullMac = aesCmac(sesAuthKey, Buffer.alloc(0), { returnAsBuffer: true }) as Buffer;
      
      const expectedMac = Buffer.alloc(8);
      for (let i = 0; i < 8; i++) {
        expectedMac[i] = fullMac[2 * i + 1];
      }

      const receivedMac = Buffer.from(receivedCmacHex, "hex");

      // Timing-safe Comparison
      const isValidMac = crypto.timingSafeEqual(expectedMac, receivedMac);
      if (!isValidMac) {
        return res.status(401).json({ success: false, error: "Cryptographic signature မမှန်ကန်ပါ။ ပစ္စည်းအတု ဖြစ်နိုင်ပါသည်။" });
      }

      // 3b. Update Counter in Database (if authentic)
      if (db) {
        tagData.counter = readCounter;
        tagData.updatedAt = new Date().toISOString();
        await setDoc(doc(db, "ntag_counters", uid), tagData, { merge: true });
      }

      return res.json({
        success: true,
        data: {
          uid,
          scanCount: readCounter,
          status: "AUTHENTIC",
          verifiedAt: new Date().toISOString(),
          customerName: tagData.customerName || null,
          customerPhone: tagData.customerPhone || null,
          address: tagData.address || null,
        }
      });

    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Apex Esports & Custom Jersey Store server running on http://localhost:${PORT}`);
  });
}

startServer();
