const express = require('express')
const router = express.Router()
const db = require('../db')

router.get('/new', (req, res) => {
    res.render('reviewNew', { title: 'New Review', User: req.session.user })
})

router.post('/new', async (req, res) => {
    const sql = `INSERT INTO reviews (name, user_id, game_id, rating, comment) VALUES (?,?,?,?,?)`
    //var params = [req.body.dname, req.body.dloc, req.body.dwebsite]

    db.run(sql, params, (err) => {
        if (err) {
            res.status(500).send("Server internal error")
        } else {
            res.redirect(301, '/')
        }
    })
})

module.exports = router
