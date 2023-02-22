const express = require('express');
const passport = require('passport');
const { runQuery, fetchQuery, runPreparedQuery } = require('../database');
const { getUsers, getUser } = require('../queries/user');
const router = express.Router();

/* authorization or session is not required */
// example of using fetchQuery, use fetchQuery if no arguments needed to passed, 
// and will automatically send a response when api endpoint is called
router.get('/', fetchQuery(getUsers));

// example of using runQuery, use runQuery if no arguments needed to passed, 
// but you want to have a custom response when api endpoint is called
router.get('/list', async(req, res) => {
    let resGetUsers = await runQuery(getUsers);
    // if you want to see the value of resGetUsers, just use this: console.log(resGetUsers);
    console.log(resGetUsers);
    res.status(200).json(
        {
            users: resGetUsers.recordset
        }
    );
})

// example of using runPreparedQuery, use runPreparedQuery if you have an arguments needed to be passed like for the where clause on query,
// You can create a CRUD functionalities by using this runPreparedQuery, this is what I commonly used when building an application
router.get('/list-using-runPreparedQuery', async(req, res) => {
    let resGetUser = await runPreparedQuery(getUser, { Username: "jay" });
    // if you want to see the value of resGetUser, just use this: console.log(resGetUser);
    console.log(resGetUser);
    res.status(200).json(
        {
            users: resGetUser.recordset
        }
    );
})

/* protected samples or these are the examples from above that requires authorization or a session or login, user must be authorized */
//fetchQuery
router.get('/', passport.authenticate('jwt', {session: false}), fetchQuery(getUsers));

//runQuery
router.get('/list', passport.authenticate('jwt', {session: false}), async(req, res) => {
    let resGetUsers = await runQuery(getUsers);
    // if you want to see the value of resGetUsers, just use this: console.log(resGetUsers);
    console.log(resGetUsers);
    res.status(200).json(
        {
            users: resGetUsers.recordset
        }
    );
})

//runPreparedQuery
router.get('/list-using-runPreparedQuery', passport.authenticate('jwt', {session: false}), async(req, res) => {
    let resGetUser = await runPreparedQuery(getUser, { Username: "jay" });
    // if you want to see the value of resGetUser, just use this: console.log(resGetUser);
    console.log(resGetUser);
    res.status(200).json(
        {
            users: resGetUser.recordset
        }
    );
})

// here's an example of using the runPreparedQuery with the value we get from the request data or payload
router.get('/list-using-runPreparedQuery-from-request', passport.authenticate('jwt', {session: false}), async(req, res) => {
    // please research difference between req.body and req.query - u will use these two in the future
    let { username } = req.body;
    let resGetUser = await runPreparedQuery(getUser, { Username: username });
    // if you want to see the value of resGetUser, just use this: console.log(resGetUser);
    console.log(resGetUser);
    res.status(200).json(
        {
            users: resGetUser.recordset
        }
    );
})

// here's an example of using the runPreparedQuery with the value we get from the request data or payload and a  try catch
// use try catch - no need to explain this one i guess
router.get('/list-using-runPreparedQuery-from-request-trycatch', passport.authenticate('jwt', {session: false}), async(req, res) => {
    let { username } = req.body;
    try {
        let resGetUser = await runPreparedQuery(getUser, { Username: username });
        res.status(200).json(
            {
                users: resGetUser.recordset
            }
        );
    } catch (error) {
        //if you encounter an error while running the runPreparedQuery,
        // it will automatically send a response with a status code of 500 or INTERNAL SERVER ERROR
        // please do research about HTTP STATUS CODES - you'll need this
        res.sendStatus(500);
    }
})



module.exports = router;