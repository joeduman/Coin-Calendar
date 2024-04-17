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

/////LOGIN
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
  const query = `SELECT * FROM Account WHERE username = '${username}'`;
  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });
});

app.get('/api/users/accountID', (req, res) => {
  const { username } = req.query;

  // Query to find the account ID from the account table using the provided username
  pool.query('SELECT accountID FROM Account WHERE username = ?', [username], (error, results) => {
      if (error) {
          console.error('Error fetching accountID:', error);
          return res.status(500).json({ error: 'Internal server error' });
      }

      if (results.length > 0) {
          const accountID = results[0].accountID;
          res.json({ accountID });
      } else {
          res.status(404).json({ error: 'Username not found' });
      }
  });
});

////////ADD EXPENSE
app.post('/api/expenses', (req, res) => {
  const { accountID, expenseName, category, date, cost } = req.body;
  // Create an expense object to insert into the database
  const newExpense = {
    accountID,
    expenseName,
    category,
    date,
    cost
  };
  // Insert the expense into the Expense table
  pool.query('INSERT INTO Expense SET ?', newExpense, (err, results) => {
    if (err) {
      console.error('Error inserting expense:', err);
      return res.status(500).json({ success: false, error: 'Failed to add expense' });
    }
    // Return a success message and the inserted expense data
    newExpense.expenseID = results.insertId;
    res.status(201).json({ success: true, message: 'Expense added successfully', expense: newExpense });
  });
});

////////ADD EVENT
app.post('/api/events', (req, res) => {
  const { accountID, eventName, description, repeat, datespan_start, datespan_end } = req.body;
  // Create an expense object to insert into the database
  const newEvent = {
    accountID,
    eventName,
    description,
    repeat, 
    datespan_start, 
    datespan_end
  };
  // Insert the expense into the Event table
  pool.query('INSERT INTO Event SET ?', newEvent, (err, results) => {
    if (err) {
      console.error('Error inserting event:', err);
      return res.status(500).json({ success: false, error: 'Failed to add event' });
    }
    // Return a success message and the inserted event data
    newEvent.eventID = results.insertId;
    res.status(201).json({ success: true, message: 'Event added successfully', expense: newEvent });
  });
});


////////REMOVE EVENT
app.delete('/remove/events/:id', (req, res) => {
  // Extract the event ID from the URL parameters
  const eventID = req.params.id;

  // Query to delete the event from the Event table based on its ID
  pool.query('DELETE FROM Event WHERE eventID = ?', [eventID], (err, results) => {
    if (err) {
      console.error('Error deleting event:', err);
      return res.status(500).json({ success: false, error: 'Failed to delete event' });
    }

    // Check the number of rows affected by the query
    if (results.affectedRows > 0) {
      res.status(200).json({ success: true, message: 'Event deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Event not found' });
    }
  });
});


////////REMOVE EXPENSE
app.delete('/remove/expenses/:id', (req, res) => {
  // Extract the expense ID from the URL parameters
  const expenseID = req.params.id;

  // Query to delete the expense from the Expense table based on its ID
  pool.query('DELETE FROM Expense WHERE expenseID = ?', [expenseID], (err, results) => {
    if (err) {
      console.error('Error deleting expense:', err);
      return res.status(500).json({ success: false, error: 'Failed to delete expense' });
    }

    // Check the number of rows affected by the query
    if (results.affectedRows > 0) {
      res.status(200).json({ success: true, message: 'Expense deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Expense not found' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
