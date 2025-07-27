const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();
//const PostGres_URI = 'postgresql://username:password@localhost:5432/mydatabase';
  
const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.PostGres_URI,
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  console.log("Login::",username,":::",password);
  try {
    const query = 'SELECT * FROM users WHERE username = $1 AND password = $2';
    const result = await pool.query(query, [username, password]);

    if (result.rows.length > 0) {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err  });
  }
});

app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;
  console.log("Signup::",username,":::",password);
  try {
    const query = 'INSERT INTO users (username,password) VALUES ($1,$2)';        
    const result = await pool.query(query, [username, password]);
    if (result.rowCount > 0) {
      res.status(201).json({ success: true, message: 'User created successfully' });
    } else {
      res.status(401).json({ success: false, message: 'Failed to create user' });
    }
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
});

app.get('/users0676', async (req,res) => {
  console.log("Users::");
  try {
    const result = await pool.query("SELECT username from users");
    const usernames = result.rows.map(row => row.username);
    res.json(usernames);
  } catch (err) {
    console.error('Error in getting users', err);
    res.json({ getusers: false, message: 'Error in getting users', error: err });
  }
});

app.get('/test', async (req,res) => {
  res.json({ test: true, message: 'This is the test message' });
});

app.get('/makeDB0674', async (req,res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      )
    `);
    console.log('Users table ready');
    res.json({ makedb: true, message: 'Created the DB' });
  } catch (err) {
    console.error('Error creating users table:', err);
    res.json({ makedb: false, message: 'error in making db', error: err });
  }
});

app.get('/makeDBPlay0673', async (req,res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS games (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL,
        color TEXT NOT NULL,
        computer TEXT NOT NULL,
        timeWhite TEXT NOT NULL,
        timeBlack TEXT NOT NULL,
        pgn TEXT NOT NULL
      )
    `);
    console.log('Games table ready');
    res.json({ makedb: true, message: 'Created the Games table' });
  } catch (err) {
    console.error('Error creating games table:', err);
    res.json({ makedb: false, message: 'error in making games table', error: err });
  }
});

app.get('/addToDB0675', async (req,res) => {
  try {
    await pool.query(`
      INSERT INTO users (username, password) VALUES ('user001', 'pwd001')
    `);
    console.log('Added a user');
    res.json({ makedb: true, message: 'Added a user' });
  } catch (err) {
    console.error('Error adding a user:', err);
    res.json({ makedb: false, message: 'Error adding a user', error: err });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
