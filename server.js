const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'submissions.json');
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.redirect('/survey');
});

app.get('/survey', (req, res) => {
  res.sendFile(path.join(__dirname, 'Mpintshi_Waitlist.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'Mpintshi_Waitlist.html'));
});

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf8');
}

function readData() {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(raw || '[]');
}

function writeData(data) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function makeId(items) {
  return 'MP-' + String(items.length + 1).padStart(4, '0');
}

function requireAdmin(req, res, next) {
  if (!ADMIN_TOKEN) {
    if (process.env.NODE_ENV === 'production') {
      return res.status(503).json({ error: 'ADMIN_TOKEN is required in production.' });
    }
    return next();
  }

  const authHeader = req.get('authorization') || '';
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  const suppliedToken = req.get('x-admin-token') || req.query.admin_token || bearerToken;

  if (suppliedToken !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Admin access required.' });
  }

  next();
}

app.get('/api/submissions', requireAdmin, (req, res) => {
  try {
    const submissions = readData();
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: 'Unable to read submissions.' });
  }
});

app.post('/api/submit', (req, res) => {
  try {
    const payload = req.body;
    const submissions = readData();
    const id = makeId(submissions);
    const entry = {
      id,
      full_name: payload.full_name || '',
      phone: payload.phone || '',
      province: payload.province || '',
      city: payload.city || '',
      community: payload.community || {},
      extra_groups: Array.isArray(payload.extra_groups) ? payload.extra_groups : [],
      submitted_at: new Date().toISOString()
    };
    submissions.push(entry);
    writeData(submissions);
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Unable to save submission.' });
  }
});

app.listen(PORT, () => {
  console.log(`Mpintshi survey server listening on http://localhost:${PORT}`);
});
