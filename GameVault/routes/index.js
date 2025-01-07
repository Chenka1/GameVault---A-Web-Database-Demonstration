const express = require('express')
const router = express.Router()
const db = require('../db')

router.get('/', (req, res) => {
  const sql = `select * from reviews`
  var params = []

  db.all(sql, params, (err, rows) => {
    if (err) {
        res.status(400).send(err.message)
    } else {
      if (req.session.user) {
        res.render('home', {title: 'Home', User: req.session.user, reviews: rows})
      } else {
        res.render('home', {title: 'Home', reviews: rows})
      }
    }
  })
})

module.exports = router
