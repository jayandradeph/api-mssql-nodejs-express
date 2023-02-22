require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const passport = require('passport');
const compression = require('compression');
const app = express();

//ROUTER
const userRouter = require('./routers/user');

app.use(compression());
app.use(express.static('public'));
app.use(cors({ credentials: true, origin: process.env.ALLOWED_ORIGINS }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: true,
      saveUninitialized: true,
      rolling: true, // forces resetting of max age
      cookie: {
        maxAge: 360000,
        secure: false // this should be true only when you don't want to show it for security reason
      }
    })
);
app.use(passport.initialize());
app.use(passport.session());

//API PATH
app.use('/api/user', userRouter);

async function start() {
    try {
        app.listen(process.env.HTTP_PORT, () => {
            console.log(`Connected to port: ${process.env.HTTP_PORT}`)
        })
    } catch(err) {
        console.log(err);
    }
}

start();