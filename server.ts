import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { aesCmac } from 'node-aes-cmac';
import { createServer as createViteServer } from 'vite';

dotenv.config();

// NTAG Verification Keys and Storage
const KEY_01_HEX = process.env.NTAG_KEY_01 || "00000000000000000000000000000000"; // Meta Read Key (PICC Decrypt)
const KEY_02_HEX = process.env.NTAG_KEY_02 || "00000000000000000000000000000000"; // SDM File Read Key (CMAC)
const lastKnownCounters: Record<string, number> = {};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // NTAG Verification Endpoint
  app.get('/api/verify', (req, res) => {
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

      // 1. PICC Data Decryption (AES-128-CBC)
      const decipher = crypto.createDecipheriv("aes-128-cbc", key01, Buffer.alloc(16, 0));
      decipher.setAutoPadding(false);
      const decryptedPicc = Buffer.concat([decipher.update(piccCiphertext), decipher.final()]);

      // Format: 0xC7 (1B) + UID (7B) + ReadCounter (3B little-endian) + Padding (5B)
      const uid = decryptedPicc.subarray(1, 8).toString("hex").toUpperCase();
      const readCounter = decryptedPicc.readUIntLE(8, 3);

      // 2. Anti-Replay Counter Check
      const lastCounter = lastKnownCounters[uid] ?? -1;
      if (readCounter <= lastCounter) {
        return res.status(403).json({
          success: false,
          error: "Replay detected. ဤလင့်ခ်ကို ယခင်က အသုံးပြုပြီးဖြစ်သည် သို့မဟုတ် ကော်ပီလင့်ခ်ဖြစ်နေပါသည်။",
          uid,
          readCounter
        });
      }

      // 3. Session Key Derivation
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

      // 4. AES-CMAC and 8-byte Truncation
      const fullMac = aesCmac(sesAuthKey, Buffer.alloc(0), { returnAsBuffer: true }) as Buffer;
      
      const expectedMac = Buffer.alloc(8);
      for (let i = 0; i < 8; i++) {
        expectedMac[i] = fullMac[2 * i + 1];
      }

      const receivedMac = Buffer.from(receivedCmacHex, "hex");

      // 5. Timing-safe Comparison
      const isValidMac = crypto.timingSafeEqual(expectedMac, receivedMac);
      if (!isValidMac) {
        return res.status(401).json({ success: false, error: "Cryptographic signature မမှန်ကန်ပါ။ ပစ္စည်းအတု ဖြစ်နိုင်ပါသည်။" });
      }

      // Update Counter
      lastKnownCounters[uid] = readCounter;

      return res.json({
        success: true,
        data: {
          uid,
          scanCount: readCounter,
          status: "AUTHENTIC",
          verifiedAt: new Date().toISOString()
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
