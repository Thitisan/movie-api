const express = require('express')
const router = express.Router()

const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');

const userMiddleware = require('../middleware/users.js');

module.exports = router

//ลอง get ค่าจาก db
router.get('/data', async(req, res, next) => {
    try {
        let rows = await req.db("user_login").where('username', '=', 'test01')
        let datenow = new Date()
        datenow = new Date(datenow.getTime());
        var date_format_str = datenow.getFullYear().toString() + "-" + ((datenow.getMonth() + 1).toString().length == 2 ? (datenow.getMonth() + 1).toString() : "0" + (datenow.getMonth() + 1).toString()) + "-" + (datenow.getDate().toString().length == 2 ? datenow.getDate().toString() : "0" + datenow.getDate().toString()) + " " + (datenow.getHours().toString().length == 2 ? datenow.getHours().toString() : "0" + datenow.getHours().toString()) + ":" + ((parseInt(datenow.getMinutes() / 5) * 5).toString().length == 2 ? (parseInt(datenow.getMinutes() / 5) * 5).toString() : "0" + (parseInt(datenow.getMinutes() / 5) * 5).toString()) + ":00";
        res.send({
            ok: true,
            id: rows,
            date: date_format_str
        })
    } catch (e) {
        res.send({ ok: false, error: e.message })
    }
})

router.post('/sign-up', userMiddleware.validateRegister, async(req, res, next) => {
    let db = req.db
    let rows = await db('user_login')
    let datenow = new Date()
    datenow = new Date(datenow.getTime());
    var date_format_str = datenow.getFullYear().toString() + "-" + ((datenow.getMonth() + 1).toString().length == 2 ? (datenow.getMonth() + 1).toString() : "0" + (datenow.getMonth() + 1).toString()) + "-" + (datenow.getDate().toString().length == 2 ? datenow.getDate().toString() : "0" + datenow.getDate().toString()) + " " + (datenow.getHours().toString().length == 2 ? datenow.getHours().toString() : "0" + datenow.getHours().toString()) + ":" + ((parseInt(datenow.getMinutes() / 5) * 5).toString().length == 2 ? (parseInt(datenow.getMinutes() / 5) * 5).toString() : "0" + (parseInt(datenow.getMinutes() / 5) * 5).toString()) + ":00";
    if (rows.username == req.body.username) {
        return res.status(409).send({
            msg: 'this username is already in use'
        })
    } else {
        bcrypt.hash(req.body.password, 10, async(err, hash) => {
            if (err) {
                return res.status(500).send({
                    msg: err
                })
            } else {
                let insertDB = await db('user_login').insert({
                    id: uuid.v4(),
                    username: req.body.username,
                    password: hash,
                    registered: date_format_str
                })
                return res.status(201).send({
                    msg: 'Registered',
                    user: insertDB
                })
            }
        })
    }

})

router.post('/login', async(req, res, next) => {
    let db = req.db
    let rows = await db('user_login').where('username', '=', req.body.username)
    let datenow = new Date()
    datenow = new Date(datenow.getTime());
    var date_format_str = datenow.getFullYear().toString() + "-" + ((datenow.getMonth() + 1).toString().length == 2 ? (datenow.getMonth() + 1).toString() : "0" + (datenow.getMonth() + 1).toString()) + "-" + (datenow.getDate().toString().length == 2 ? datenow.getDate().toString() : "0" + datenow.getDate().toString()) + " " + (datenow.getHours().toString().length == 2 ? datenow.getHours().toString() : "0" + datenow.getHours().toString()) + ":" + ((parseInt(datenow.getMinutes() / 5) * 5).toString().length == 2 ? (parseInt(datenow.getMinutes() / 5) * 5).toString() : "0" + (parseInt(datenow.getMinutes() / 5) * 5).toString()) + ":00";

    // user does not exists
    if (rows[0].username !== req.body.username) {
        return res.send({
            msg: 'Username or password is incorrect!'
        })
    }
    //check passwrod
    bcrypt.compare(
        req.body.password,
        rows[0].password,
        async(bErr, bResult) => {
            // wrong password
            if (bErr) {
                throw bErr;
                return res.status(401).send({
                    msg: 'Username or password is incorrect!'
                });
            }
            if (bResult) {
                const token = jwt.sign({
                        username: rows[0].username,
                        userId: rows[0].id
                    },
                    //Secret key
                    'CatLover', {
                        expiresIn: '7d'
                    })
                await db('user_login').where({ id: rows[0].id }).update({
                    last_login: date_format_str
                })
                return res.send({
                    msg: 'Logged in',
                    token,
                    user: rows[0]
                })
            }
        }
    )
})

// check login
router.get('/secret-route', userMiddleware.isLoggedIn, (req, res, next) => {
    res.send('This is the secret content. Only logged in users can see that!');
});

router.get('/user', userMiddleware.isLoggedIn, (req, res, next) => {
    res.send({
        user: {
            data: 'a',
            pass: 'b'
        }
    });
});