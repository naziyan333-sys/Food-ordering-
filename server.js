// 1. Import required tools
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors()); // Allows your HTML file to talk to this server
app.use(express.json()); // Parse JSON bodies
app.use(express.static(__dirname)); // Allows the server to read JSON data

// 2. Connect to your SQL Database
const db = mysql.createConnection({
    host: 'localhost',       // Replace with your database host
    user: 'root',            // Replace with your database username
    password: 'mom9603024041dad',    // Replace with your database password
    database: 'street'       // The database name we created
});

db.connect((err) => {
    if (err) throw err;
    console.log('✅ Successfully connected to the Street Cafe Database!');
});

// ==========================================
// API ENDPOINTS (The Bridge Routes)
// ==========================================

// 1. SEND THE MENU TO THE WEBSITE
app.get('/api/menu', (req, res) => {
    const sql = "SELECT * FROM Imaster";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results); // Sends the 161 items to your HTML file!
    });
});

// 2. ADMIN UPDATE PRICE OR AVAILABILITY
app.put('/api/menu/update', (req, res) => {
    const { icode, newPrice, available } = req.body;
    const sql = "UPDATE Imaster SET price = ?, available = ? WHERE icode = ?";
    
    db.query(sql, [newPrice, available, icode], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Item updated successfully!" });
    });
});

// 3. SAVE CUSTOMER DETAILS WHEN ORDERING
app.post('/api/order', (req, res) => {
    const { name, phone, address } = req.body;
    
    // Check if customer exists, if not, insert them into umaster
    const sql = `INSERT INTO umaster (uname, unumber, uaddress) 
                 VALUES (?, ?, ?) 
                 ON DUPLICATE KEY UPDATE uaddress = ?`;
                 
    db.query(sql, [name, phone, address, address], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Order processed and customer saved!" });
    });
});

// Start the server on port 3000
app.listen(3000, () => {
    console.log('🚀 Server running on http://localhost:3000');
});