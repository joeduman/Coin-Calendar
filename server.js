const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: 'localhost', // Remove port number
  user: 'root',
  password: '',
  database: 'coincalendar'
});
/////// SIGN UP
app.post('/signup', (req, res) => {
  const { username, password, fname, lname, email, phone } = req.body;

  // Query the last inserted accountID
  pool.query('SELECT MAX(accountID) AS maxAccountID FROM Account', (error, results) => {
    if (error) {
      console.error('Error fetching max accountID:', error);
      res.status(500).json({ error: 'Error signing up. Please try again.' });
      return;
    }

    // Calculate the next available accountID
    const nextAccountID = results[0].maxAccountID ? results[0].maxAccountID + 1 : 1;

    const newUser = {
      accountID: nextAccountID,
      username,
      password,
      fname,
      lname,
      email,
      phone
    };

    pool.query('INSERT INTO Account SET ?', newUser, (insertError, insertResults) => {
      if (insertError) {
        console.error('Error signing up:', insertError);
        res.status(500).json({ error: 'Error signing up. Please try again.' });
        return;
      }
      res.status(201).json({ message: 'Sign up successful', accountID: nextAccountID });
    });
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check username and password in database
  const query = `SELECT * FROM Account WHERE username = '${username}' AND password = '${password}'`;
  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }

    // Check if user exists in database
    if (results.length > 0) {
      return res.json({ success: true });
    } else {
      return res.status(401).json({ success: false, error: 'Invalid username or password' });
    }
  });
});

app.get("/expenses/:username", (req, res) => {
  const username = req.params.username; // Use the parameter passed in the URL
  const pre_query = `SELECT accountID FROM Account WHERE username = '${username}'`;
  pool.query(pre_query, (pre_err, pre_results) => {
    if (pre_err) {
      console.error('Error executing pre_query:', pre_err);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }

    // Extract accountID from the pre_results
    const accountID = pre_results[0].accountID;

    const query = `SELECT * FROM Expense WHERE accountID = '${accountID}'`;
    pool.query(query, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ success: false, error: 'Internal server error' });
      } else {
        res.send(results); // Corrected variable name
      }
    });
  });
});

app.get("/events/:username", (req, res) => {
  const username = req.params.username; // Use the parameter passed in the URL
  const pre_query = `SELECT accountID FROM Account WHERE username = '${username}'`;
  pool.query(pre_query, (pre_err, pre_results) => {
    if (pre_err) {
      console.error('Error executing pre_query:', pre_err);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }

    // Extract accountID from the pre_results
    const accountID = pre_results[0].accountID;

    const query = `SELECT * FROM Event WHERE accountID = '${accountID}'`;
    pool.query(query, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ success: false, error: 'Internal server error' });
      } else {
        res.send(results); // Corrected variable name
      }
    });
  });
});

app.get("/recurring/:username", (req, res) => {
  const username = req.params.username; // Use the parameter passed in the URL
  const pre_query = `SELECT accountID FROM Account WHERE username = '${username}'`;
  pool.query(pre_query, (pre_err, pre_results) => {
    if (pre_err) {
      console.error('Error executing pre_query:', pre_err);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }

    // Extract accountID from the pre_results
    const accountID = pre_results[0].accountID;

    const query = `SELECT * FROM \`Recurring-bill\` WHERE accountID = '${accountID}'`;
    pool.query(query, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ success: false, error: 'Internal server error' });
      } else {
        res.send(results); // Corrected variable name
      }
    });
  });
});

app.get("/details/:username", (req, res) => {
  const username = req.params.username; // Use the parameter passed in the URL
  const query = `SELECT * FROM Account WHERE username = "test"`;
  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
