const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const DB_FILE = './users.json';

function readDB() {
    try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); }
    catch(e) { return {}; }
}
function writeDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

app.post('/api/register', (req, res) => {
    const { email, name, password } = req.body;
    const db = readDB();
    if (db[email]) return res.json({ ok: false, error: 'Email exists!' });
    db[email] = { name, password, data: { b:0, c:0, i1:[], i2:[], i3:[], m1:5, m2:5, m3:5, al:0, as:0, al2:0, as2:0, al3:0, as3:0, g2unlocked:false, g3unlocked:false, te:0, clicks:0, pl:0, prestigeCost:100000 } };
    writeDB(db);
    res.json({ ok: true, name: name });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const db = readDB();
    const user = db[email];
    if (!user || user.password !== password) return res.json({ ok: false, error: 'Wrong email/password!' });
    res.json({ ok: true, name: user.name });
});

app.post('/api/save', (req, res) => {
    const { email, data } = req.body;
    const db = readDB();
    if (db[email]) { db[email].data = data; writeDB(db); }
    res.json({ ok: true });
});

app.post('/api/load', (req, res) => {
    const { email } = req.body;
    const db = readDB();
    const user = db[email];
    res.json({ ok: true, data: user ? user.data : null });
});

app.get('/api/leaderboard', (req, res) => {
    const db = readDB();
    const list = Object.entries(db).map(([email, u]) => ({
        name: u.name,
        prestige: u.data.pl || 0,
        earned: u.data.te || 0
    }));
    list.sort((a, b) => b.earned - a.earned);
    res.json(list.slice(0, 10));
});

app.listen(PORT, () => console.log('Server running on port ' + PORT));
