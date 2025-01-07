const express = require('express')
const router = express.Router()
const md5 = require('md5')
const db = require('../db')

router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' })
})

router.get('/signup', (req, res) => {
    res.render('signup', { title: 'Register' })
})
  
router.post('/login', async (req, res) => {
    const sql1 = `select * from users where email = ?`
    const sql2 = `select * from users where email = ? and password = ?`
    var params1 = [req.body.email]
    var params2 = [req.body.email, md5(req.body.pswd)]

    db.get(sql1, params1, (err, row) => {
        if (err) {
            res.status(500).send("Server internal error")
        }
        if (row) {
            db.get(sql2, params2, (err, r) => {
                if (err) {
                    res.status(500).send("Server internal error")
                }
                if (r) {
                    req.session.user = r.user_name
                    req.session.save((err) => {
                        if (err) return next(err)
                        if (r.user_name == 'admin') {
                            res.redirect(301, '/')
                        } else {
                            res.redirect(301, '/user/'+r.user_id)
                        }
                    })
                } else {
                    res.render('login', { title: 'Login', message: 'Login failed', msgType: "Warning" })
                }
            })
        } else {
            res.redirect(301, '/auth/signup')
        }
    })
})

router.post('/register', async (req, res) => {
    const sql = `INSERT INTO users (user_name, password, email) VALUES (?,?,?)`
    var params = [req.body.uname, md5(req.body.pswd), req.body.email]

    db.run(sql, params, (err) => {
        if (err) {
            res.status(500).send("Server internal error")
        } else {
            res.redirect(301, '/auth/login')
        }
    })
})

module.exports = router
