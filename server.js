const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const generator = require('generate-password');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const pool = mysql.createPool({
  host: 'localhost', // Remove port number
  user: 'root',
  password: '',
  database: 'coincalendar'
});
/////// SIGN UP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/signup', async (req, res) => {
  const { username, password, fname, lname, email, phone } = req.body;

  // Check if the username already exists
  const checkUsernameQuery = `SELECT * FROM Account WHERE username = ?`;
  pool.query(checkUsernameQuery, [username], async (checkError, checkResults) => {
    if (checkError) {
      console.error('Error checking username:', checkError);
      return res.status(500).json({ error: 'Error signing up. Please try again.' });
    }

    // If username already exists, return error
    if (checkResults.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Query the last inserted accountID
    pool.query('SELECT MAX(accountID) AS maxAccountID FROM Account', async (error, results) => {
      if (error) {
        console.error('Error fetching max accountID:', error);
        return res.status(500).json({ error: 'Error signing up. Please try again.' });
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

      try {
        // Insert user data into the database
        await pool.query('INSERT INTO Account SET ?', newUser);

        // Send welcome email
        const mailOptions = {
          from: `"The Coin Calendar" <${process.env.EMAIL_ADDRESS}>`,
          to: email,
          subject: 'Welcome to Coin Calendar',
          text: `Hi ${username},\n\nThank you for signing up!\n\nBest regards,\nThe Coin Calendar Team`
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: 'Sign up successful', accountID: nextAccountID });
      } catch (insertError) {
        console.error('Error signing up:', insertError);
        res.status(500).json({ error: 'Error signing up. Please try again.' });
      }
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


///////RESET PASSWORD
app.post('/resetpassword', async (req, res) => {
  const { username, email } = req.body;

  // Check username and email in database
  const query = `SELECT * FROM Account WHERE username = '${username}' AND email = '${email}'`;
  pool.query(query, async (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }

    // Check if user exists in database
    if (results.length > 0) {
      try {
        // Generate a new code
        var code = generator.generate({
          length: 10,
          numbers: true
        });

        // Delete existing entries for the user from resetpassword table
        // const deleteQuery = 'DELETE FROM resetpassword WHERE username = ?';
        // await pool.query(deleteQuery, [username]);

        // Insert new entry for the user into resetpassword table
        const insertQuery = 'INSERT INTO resetpassword (username, code) VALUES (?, ?)';
        await pool.query(insertQuery, [username, code]);

        // Send password reset email
        const mailOptions = {
          from: `"The Coin Calendar" <${process.env.EMAIL_ADDRESS}>`,
          to: email,
          subject: 'Reset Your Password',
          text: `Hi ${username},\n\nHere is the code you can use to create a new password: ${code}\n\nBest regards,\nThe Coin Calendar Team`
        };

        await transporter.sendMail(mailOptions);
        return res.json({ success: true });
      } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ success: false, error: 'Error sending reset password email' });
      }
    } else {
      // User not found
      return res.status(401).json({ success: false, error: 'Invalid username or email' });
    }
  });
});


//////GATEWAY CHECK CODE
app.post('/code', async (req, res) => {
  const { username, code } = req.body;

  // Query the resetpassword table to check if the username and code match
  const query = `SELECT * FROM resetpassword WHERE username = ? AND code = ?`;
  pool.query(query, [username, code], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }

    // If a matching entry is found, delete the code and return success
    if (results.length > 0) {
      // Delete the code from the resetpassword table
      pool.query('DELETE FROM resetpassword WHERE code = ?', [code], (deleteErr, deleteResults) => {
        if (deleteErr) {
          console.error('Error deleting code:', deleteErr);
          return res.status(500).json({ success: false, error: 'Failed to delete code' });
        }

        // Send success response
        return res.json({ success: true });
      });
    } else {
      // If no matching entry is found, return error
      return res.status(401).json({ success: false, error: 'Invalid username or code' });
    }
  });
});



//////CHANGE PASSWORD
app.post('/changepass', (req, res) => {
  const { username, newPassword } = req.body;

  // Update the password for the given username in the database
  const updateQuery = 'UPDATE Account SET password = ? WHERE username = ?';
  pool.query(updateQuery, [newPassword, username], (error, results) => {
    if (error) {
      console.error('Error updating password:', error);
      // Send an error response
      return res.status(500).json({ success: false, error: 'Error updating password. Please try again.' });
    }

    // Check if any rows were affected by the update
    if (results.affectedRows > 0) {
      // Send a success response
      return res.json({ success: true, message: 'Password updated successfully' });
    } else {
      // If no rows were affected, it means the username was not found
      return res.status(404).json({ success: false, error: 'Username not found' });
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

app.get("/userinfo/:username", (req, res) => {
  const username = req.params.username; // Use the parameter passed in the URL
  const query = `SELECT * FROM Account WHERE username = '${username}'`;
  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    } else {
      res.send(results); // Corrected variable name
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


//////////DELETE ACCOUNT
app.delete('/deleteaccount/:username', (req, res) => {
  const { username } = req.params;

  // First, find the user's accountID
  pool.query('SELECT accountID FROM Account WHERE username = ?', [username], (err, userResults) => {
    if (err) {
      console.error('Error finding user:', err);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }

    if (userResults.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const accountId = userResults[0].accountID;

    // Define functions to delete expenses, events, and recurring bills
    const deleteExpenses = () => {
      pool.query('DELETE FROM Expense WHERE accountID = ?', [accountId], (err, expenseResults) => {
        if (err) {
          console.error('Error deleting expenses:', err);
          return res.status(500).json({ success: false, error: 'Failed to delete expenses' });
        }
        deleteEvents();
      });
    };

    const deleteEvents = () => {
      pool.query('DELETE FROM Event WHERE accountID = ?', [accountId], (err, eventResults) => {
        if (err) {
          console.error('Error deleting events:', err);
          return res.status(500).json({ success: false, error: 'Failed to delete events' });
        }
        deleteRecurringBills();
      });
    };

    const deleteRecurringBills = () => {
      pool.query('DELETE FROM `Recurring-Bill` WHERE accountID = ?', [accountId], (err, recurringBillResults) => {
        if (err) {
          console.error('Error deleting recurring bills:', err);
          return res.status(500).json({ success: false, error: 'Failed to delete recurring bills' });
        }
        deleteUser();
      });
    };

    const deleteUser = () => {
      // Finally, delete the user
      pool.query('DELETE FROM Account WHERE username = ?', [username], (err, userDeleteResult) => {
        if (err) {
          console.error('Error deleting user:', err);
          return res.status(500).json({ success: false, error: 'Failed to delete user' });
        }

        if (userDeleteResult.affectedRows > 0) {
          return res.status(200).json({ success: true, message: 'User account and associated data deleted successfully' });
        } else {
          return res.status(404).json({ success: false, error: 'User not found' });
        }
      });
    };

    // Check if the user has expenses, events, and recurring bills
    if (userResults.length > 0) {
      deleteExpenses();
    } else {
      deleteUser();
    }
  });
});

////////UPDATE USER INFORMATION FROM SETTINGS 
app.put('/userupdate/:username', (req, res) => {
  const { username } = req.params;
  const { fname, lname, email, phone, password, newpassword } = req.body;

  console.log(newpassword);
  // Assuming you have a database connection pool named 'pool'

  // First, check if the user exists
  pool.query('SELECT * FROM Account WHERE username = ?', [username], (err, userResults) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }

    if (userResults.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const user = userResults[0];

    // If the provided password doesn't match the user's current password, return an error
    if (password !== user.password) {
      return res.status(400).json({ success: false, error: 'Incorrect password' });
    }

    // Construct the update query based on which fields are provided in the request
    const updateFields = [];
    const updateValues = [];

    if (fname) {
      updateFields.push('fname = ?');
      updateValues.push(fname);
    }

    if (lname) {
      updateFields.push('lname = ?');
      updateValues.push(lname);
    }

    if (email) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }

    if (phone) {
      updateFields.push('phone = ?');
      updateValues.push(phone);
    }

    // Check if newpassword is provided and not null
    if (newpassword != undefined) {
      updateFields.push('password = ?');
      updateValues.push(newpassword);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, error: 'No fields provided for update' });
    }

    // Add username to the update values array
    updateValues.push(username);

    // Update the user in the database
    const updateQuery = `UPDATE Account SET ${updateFields.join(', ')} WHERE username = ?`;

    pool.query(updateQuery, updateValues, (err, updateResult) => {
      if (err) {
        console.error('Error updating user:', err);
        return res.status(500).json({ success: false, error: 'Failed to update user' });
      }

      if (updateResult.affectedRows > 0) {
        return res.status(200).json({ success: true, message: 'User updated successfully' });
      } else {
        return res.status(500).json({ success: false, error: 'Failed to update user' });
      }
    });
  });
});








app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
