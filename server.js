const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const db = new sqlite3.Database(path.join(__dirname, 'zootherapy.db'), (err) => {
    if (err) console.error('Помилка підключення:', err.message);
    else console.log('Успішно підключено до zootherapy.db');
});

app.get('/api/clinics', (req, res) => {
    db.all('SELECT * FROM clinics', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});
app.post('/api/clinics', (req, res) => {
    const { name, city, address, phone, therapy_type, description } = req.body;
    const sql = `INSERT INTO clinics (name, city, address, phone, therapy_type, description) VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.run(sql, [name, city, address, phone, therapy_type, description], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Клініку успішно додано!', id: this.lastID });
    });
});
app.get('/api/events', (req, res) => {
    db.all('SELECT * FROM events', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/announcements', (req, res) => {
    db.all('SELECT * FROM announcements ORDER BY id DESC', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.post('/api/announcements', (req, res) => {
    const { title, category, district, phone, description } = req.body;
    if (!title || !category || !district || !phone || !description) {
        return res.status(400).json({ error: 'Будь ласка, заповніть усі поля' });
    }

    const sql = 'INSERT INTO announcements (title, category, district, phone, description) VALUES (?, ?, ?, ?, ?)';
    const params = [title, category, district, phone, description];

    db.run(sql, params, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, message: 'Оголошення успішно додано!' });
    });
});

app.listen(PORT, () => {
    console.log(`Сервер працює на порту ${PORT}`);
});