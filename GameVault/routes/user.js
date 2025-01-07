const express = require('express')
const router = express.Router()
const md5 = require('md5');
const db = require('../db')

router.get('/view', (req, res) => {
    const sql = `select user_id, user_name, email from users`
    var params = []

    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).send(err.message);
        } else {
          res.render('user', {title: 'Users', users: rows, User: req.session.user})
        }
    })
})

router.get('/:id', (req, res) => {
    const sql = `select user_id, user_name, email from users where user_id = ?`
    var params = [req.params.id]

    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).send(err.message);
        } else {
            res.render('user', {title: 'Profile', users: rows, User: req.session.user})
        }
    })
})

module.exports = router
