const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const randtoken = require('rand-token');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const cors = require('cors');
const express = require('express');
const app = express();

const refreshTokens = {};
const SECRET = 'VERY_SECRET_KEY!';
const passportOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

passport.use(new JwtStrategy(passportOpts, function (jwtPayload, done) {
  const expirationDate = new Date(jwtPayload.exp * 1000);
  if(expirationDate < new Date()) {
    return done(null, false);
  }
  done(null, jwtPayload);
}))

passport.serializeUser(function (user, done) {
  done(null, user.username)
});


const mysql = require ('mysql');
const bcrypt= require('bcrypt');
const exjwt = require('express-jwt');
const path = require('path');

const PORT = 3000;


// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-type-Authorization');
//     next();
// });


// const secretKey = 'My super secret key';
// const jwtMW = exjwt( {
//     secret: secretKey,
//     algorithms: ['HS256']
// });

var connection = mysql.createPool({
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

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'index.html'));
// });



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
                // let token = jwt.sign({id: results[0].id, username: results[0].username}, secretKey, { expiresIn: '1m' });
                // res.json({
                //     success: true,
                //     err: null,
                //     token
                const {username, password} = req.body;
                const user = { 
                    'username': username, 
                    'role': 'admin'
                };
                const token = jwt.sign(user, SECRET, { expiresIn: '1m' }) 
                const refreshToken = randtoken.uid(256);
                refreshTokens[refreshToken] = username;
                res.json({jwt: token, refreshToken: refreshToken});
                // });
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

app.post('/api/logout', function (req, res) { 
    const refreshToken = req.body.refreshToken;
    if (refreshToken in refreshTokens) { 
      delete refreshTokens[refreshToken];
    } 
    res.sendStatus(204); 
  });

  app.post('/api/refresh', function (req, res) {
    const refreshToken = req.body.refreshToken;
    

    if (refreshToken in refreshTokens) {
      const user = {
        'username': refreshTokens[refreshToken],
        'role': 'admin'
      }
      const token = jwt.sign(user, SECRET, { expiresIn: 600 });
      res.json({jwt: token})
    }
    else {
      res.sendStatus(401);
    }
});

app.get('/api/budget', async (req, res) => {
    connection.query('SELECT * FROM chartData', function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });
});

app.get('/api/budget/:id', async (req, res) => {
    var id = req.params.id;
    connection.query('SELECT * FROM chartData WHERE id = ?', [id], function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });
});

app.delete('/api/budget/:id', async (req, res) => {
    var id = req.params.id;
    connection.query('DELETE FROM chartData WHERE id = ?', [id], function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });
});

app.post('/api/budget', (req, res) => {
    const { title, budget, color, expenses } = req.body;
    var re = new RegExp("^#(?:[0-9a-fA-F]{3}){1,2}$");
    if (re.test(color)) {
        connection.query('INSERT INTO chartData VALUES ("", ?, ?, ?, ?)', [title, budget, color, expenses], function (error, results, fields) {
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

app.put('/api/budget/:id', (req, res) => {
    const { title, budget, color, expenses } = req.body;
    var id = req.params.id;
    var re = new RegExp("^#(?:[0-9a-fA-F]{3}){1,2}$");
    if (re.test(color)) {
        connection.query('UPDATE chartData SET title = ?, budget = ?, color = ?, expenses = ? WHERE id = ?', [title, budget, color, expenses, id], function (error, results, fields) {
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


// app.get('/api/dashboard', jwtMW, (req, res) => {
//     res.json({
//         success: true,
//         myContent: 'Secret content that only logged in people can see.'
//     });
// });

// app.get('/api/settings', jwtMW, (req, res) => {
//     res.json({
//         success: true,
//         myContent: 'Here you can set all the things.'
//     });
// });

// app.get('/api/timeout', (req, res) => {
//     res.json({
//         success: true,
//         myContent: 'Sorry, your session has timed out. You will be redirected to the login page in 5 seconds.'
//     });
// });

// Redirect to index.html
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'index.html'));
// });


// app.use(function (err, req, res, next) {
//     if (err.name === 'UnauthorizedError' && err.inner.name === 'TokenExpiredError') {
//         res.status(401).json({
//             success: false,
//             officialError: err,
//             err: 'Token is expired'
//         });
//     }
//     else if (err.name === 'UnauthorizedError') {
//         res.status(401).json({
//             success: false,
//             officialError: err,
//             err: 'Username or password is incorrect 2'
//         }); 
//     }
//     else {
//         next(err);
//     }
// });

app.listen(PORT, () => {
    console.log(`Serving on port ${PORT}`);
});


