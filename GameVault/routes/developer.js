const express = require('express')
const router = express.Router()
const db = require('../db')

router.get('/', (req, res) => {
    const sql = `select * from developers`
    var params = []
  
    db.all(sql, params, (err, rows) => {
      if (err) {
          res.status(400).send(err.message)
      } else {
        res.render('developerView', { title: 'List Developer', User: req.session.user, developers: rows })
      }
    })
})

router.get('/new', (req, res) => {
    res.render('developerNew', { title: 'New Developer', User: req.session.user })
})

router.post('/new', async (req, res) => {
    const sql = `INSERT INTO developers (name, location, website) VALUES (?,?,?)`
    var params = [req.body.dname, req.body.dloc, req.body.dwebsite]

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


router.post('/update', (req, res) => {
    const sql = `UPDATE developers SET name = ?, location = ?, website = ? WHERE developer_id = ?`;
    const params = [req.body.dname, req.body.dloc, req.body.dwebsite, req.body.did];

    db.run(sql, params, (err) => {
        if (err) {
            res.status(500).send("Internal Server Error");
        } else {
            res.redirect('/developer');
        }
    });
});

/*
router.post('/:id', async (req, res) => {
    const sql = `DELETE FROM developers WHERE developer_id = ?`
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
