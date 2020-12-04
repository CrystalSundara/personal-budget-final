const express = require('express');
const mysql = require ('mysql');
const bcrypt= require('bcrypt');
const cors = require('cors');


const app = express();
app.use(cors());

const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');
const bodyParser = require('body-parser');
const path = require('path');

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-type-Authorization');
//     next();
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 3000;

const secretKey = 'My super secret key';
const jwtMW = exjwt( {
    secret: secretKey,
    algorithms: ['HS256']
});

var connection = mysql.createConnection({
    host    : 'sql9.freemysqlhosting.net',
    user    : 'sql9373732',
    password: 's9JcgFxjXZ',
    database: 'sql9373732'
});

app.post('/api/signup', (req, res) => {
    const { username, password } = req.body;
    const date = new Date();
    const sqlDate = date.toISOString().split("T")[0];
    const bcryptedPassword = bcrypt.hashSync(password, 8); 
    // bcrypt.hash(password, 8, function( err, bcryptedPassword) {
        // connection.connect();
        connection.query('INSERT INTO users VALUES ("", ?, ?, ?)', [username, bcryptedPassword, sqlDate], function (error, results, fields) {
            // connection.end();
            if (error) throw error;
            res.json({ success: true });
        });
    // });
});

// app.get('/', async (req, res) => {
//     connection.connect();

//     connection.query('SELECT * FROM users', function (error, results, fields) {
//         connection.end();
//         if (error) throw error;
//         res.json(results);
//     });
// });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    // console.log ("username", username);
    // console.log ("password", password);
    // connection.connect();
    connection.query('SELECT * FROM users WHERE username = ?', [username], function (error, results, fields) {
        // connection.end();
        if (error) throw error;
        if (results.length == 0){
            res.status(401).json({
                success: false,
                token: null,
                err: 'Username is incorrect'
            });
        }
        else {
            if (bcrypt.compareSync(password, results[0].password)) {
                let token = jwt.sign({id: results[0].id, username: results[0].username}, secretKey, { expiresIn: '1m' });
                res.json({
                    success: true,
                    err: null,
                    token
                });
            }
            else { 
                res.status(401).json({
                    success: false,
                    token: null,
                    err: 'Password is incorrect'
                });
            }
        }
    });
});

app.get('/budget', async (req, res) => {
    connection.query('SELECT * FROM chartData', function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });
});

app.post('/api/budget', (req, res) => {
    const { title, budget, color } = req.body;
    var re = new RegExp("^#(?:[0-9a-fA-F]{3}){1,2}$");
    if (re.test(color)) {
        connection.query('INSERT INTO chartData VALUES ("", ?, ?, ?)', [title, budget, color], function (error, results, fields) {
            // connection.end();
            if (error) throw error;
            res.json({ success: true });
        });
    }
    else {
        res.status(400).json({
            success: false,
            err: 'Color is an invalid hex format'
        });
    }
});


app.get('/api/dashboard', jwtMW, (req, res) => {
    res.json({
        success: true,
        myContent: 'Secret content that only logged in people can see.'
    });
});

app.get('/api/settings', jwtMW, (req, res) => {
    res.json({
        success: true,
        myContent: 'Here you can set all the things.'
    });
});

app.get('/api/timeout', (req, res) => {
    res.json({
        success: true,
        myContent: 'Sorry, your session has timed out. You will be redirected to the login page in 5 seconds.'
    });
});

// Redirect to index.html
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'index.html'));
// });


app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError' && err.inner.name === 'TokenExpiredError') {
        res.status(401).json({
            success: false,
            officialError: err,
            err: 'Token is expired'
        });
    }
    else if (err.name === 'UnauthorizedError') {
        res.status(401).json({
            success: false,
            officialError: err,
            err: 'Username or password is incorrect 2'
        }); 
    }
    else {
        next(err);
    }
});

app.listen(PORT, () => {
    console.log(`Serving on port ${PORT}`);
});


