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
app.post('/api/contacts', (req, res) => {
    const { name, email, message } = req.body;
    const sql = `INSERT INTO messages (name, email, message) VALUES (?, ?, ?)`;
    
    db.run(sql, [name, email, message], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Повідомлення успішно відправлено!' });
    });
});

app.listen(PORT, () => {
    console.log(`Сервер працює на порту ${PORT}`);
});