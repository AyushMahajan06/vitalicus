import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors({ origin: process.env.FRONTEND_ORIGIN?.split(',') || true }));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'backend' }));

app.post('/api/prescriptions', (_req, res) =>
  res.status(501).json({ error: 'Not implemented: prescription PDF generation' })
);
app.post('/api/devices/webhook', (_req, res) =>
  res.status(501).json({ error: 'Not implemented: device ingest' })
);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`API listening on :${port}`));
