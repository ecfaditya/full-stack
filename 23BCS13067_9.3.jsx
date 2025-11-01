// server.js
// Single-file fullstack app: Express API + static single-page frontend
// Run: node server.js
const express = require('express');
const cors = require('cors');
const os = require('os');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const INSTANCE_ID = process.env.INSTANCE_ID || process.env.HOSTNAME || os.hostname();

// In-memory items store (shared only per-process)
let items = [
  { id: 1, text: `Welcome! served by ${INSTANCE_ID}`, created: new Date().toISOString() }
];

// Health check for ALB
app.get('/health', (req, res) => res.status(200).send('OK'));

// API endpoints
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend!', instance: INSTANCE_ID });
});

app.get('/api/items', (req, res) => {
  res.json(items);
});

app.post('/api/items', (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') return res.status(400).json({ error: 'text required' });
  const item = { id: items.length + 1, text, created: new Date().toISOString() };
  items.push(item);
  res.status(201).json(item);
});

// Serve single-file frontend (index.html + inline JS)
const frontendHTML = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Single-file Fullstack App</title>
  <style>
    body { font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; padding: 20px; }
    input { padding: 8px; font-size: 14px; }
    button { padding: 8px 12px; margin-left:8px; }
    pre { background:#f5f5f5; padding:10px; border-radius:6px; }
    .instance { color: #444; font-weight: 600; }
  </style>
</head>
<body>
  <h1>Single-file Fullstack App</h1>
  <p>Backend instance: <span class="instance" id="instance">loading…</span></p>

  <section>
    <h2>API Hello</h2>
    <pre id="hello">loading…</pre>
  </section>

  <section>
    <h2>Items</h2>
    <ul id="items"></ul>
    <div style="margin-top:10px;">
      <input id="text" placeholder="New item text" />
      <button id="add">Add</button>
    </div>
  </section>

  <script>
    async function fetchHello(){
      try {
        const r = await fetch('/api/hello');
        const j = await r.json();
        document.getElementById('hello').textContent = JSON.stringify(j, null, 2);
        document.getElementById('instance').textContent = j.instance || 'unknown';
      } catch (e){
        document.getElementById('hello').textContent = 'fetch error: ' + e;
      }
    }

    async function fetchItems(){
      try {
        const r = await fetch('/api/items');
        const arr = await r.json();
        const ul = document.getElementById('items');
        ul.innerHTML = '';
        arr.forEach(it => {
          const li = document.createElement('li');
          li.textContent = it.text + ' — ' + new Date(it.created).toLocaleString();
          ul.appendChild(li);
        });
      } catch (e) {
        console.error(e);
      }
    }

    async function addItem(){
      const input = document.getElementById('text');
      const text = input.value.trim();
      if (!text) return;
      try {
        const r = await fetch('/api/items', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({ text })
        });
        if (r.status === 201) {
          input.value = '';
          await fetchItems();
        } else {
          const err = await r.json().catch(()=>({}));
          alert('Error: ' + (err.error || r.status));
        }
      } catch (e) {
        alert('Network error: ' + e);
      }
    }

    document.getElementById('add').addEventListener('click', addItem);
    // initial load
    fetchHello();
    fetchItems();
    // poll so you can watch which instance responds when load balanced
    setInterval(fetchHello, 2000);
  </script>
</body>
</html>
`;

// Serve frontend at root
app.get('/', (req, res) => {
  res.type('html').send(frontendHTML);
});

// Optional: serve the same frontend for any path (helps SPAs)
app.get('*', (req,res,next) => {
  const accept = req.headers.accept || '';
  if (accept.includes('text/html')) return res.type('html').send(frontendHTML);
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT} (instance: ${INSTANCE_ID})`);
});

