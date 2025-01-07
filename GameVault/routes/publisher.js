const express = require('express')
const router = express.Router()
const db = require('../db')

router.get('/', (req, res) => {
    const sql = `select * from publishers`
    var params = []
  
    db.all(sql, params, (err, rows) => {
      if (err) {
          res.status(400).send(err.message)
      } else {
        res.render('publisherView', { title: 'List Publisher', User: req.session.user, publishers: rows })
      }
    })
})

router.get('/new', (req, res) => {
    res.render('publisherNew', { title: 'New Publisher', User: req.session.user })
})

router.post('/new', async (req, res) => {
    const sql = `INSERT INTO publishers (name, location) VALUES (?,?)`
    var params = [req.body.pname, req.body.plocation]

    db.run(sql, params, (err) => {
        if (err) {
            res.status(500).send("Server internal error")
        } else {
            res.redirect(301, '/')
        }
    })
})

router.get('/:id', (req, res) => {
    const sql = `SELECT * FROM publishers WHERE publisher_id = ?`;
    const params = [req.params.id];

    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(500).send("Internal Server Error");
        } else if (!row) {
            res.status(404).send("Publisher not found.");
        } else {
            res.render('publisherUpdate', { title: 'Update Publisher', pub: row });
        }
    });
});



router.post('/update', async (req, res) => {
    const sql = `UPDATE publishers SET name = ?, location = ? WHERE publisher_id = ?`;
    const params = [req.body.pname, req.body.ploc, req.body.pid];

    db.run(sql, params, (err) => {
        if (err) {
            res.status(500).send("Server internal error");
        } else {
            res.redirect('/publisher');
        }
    });
});


/*
router.post('/:id', async (req, res) => {
    const sql = `DELETE FROM publishers WHERE publisher_id = ?`
    var params = [req.params.id]

    db.run(sql, params, (err) => {
        if (err) {
            res.status(500).send("Server internal error")
        } else {
            res.redirect(301, '/')
        }
    })
})
*/
module.exports = router
