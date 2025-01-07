const express = require('express');
const router = express.Router();
const db = require('../db');

// List all genres
router.get('/', (req, res) => {
    const sql = `SELECT * FROM genres`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send("Internal Server Error");
        } else {
            res.render('genreView', { title: 'Genre List', genres: rows });
        }
    });
});

// Render the new genre form
router.get('/new', (req, res) => {
    res.render('genreNew', { title: 'New Genre' });
});

// Add a new genre
router.post('/new', (req, res) => {
    const sql = `INSERT INTO genres (name) VALUES (?)`;
    const params = [req.body.gname];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(500).send("Server internal error");
        } else {
            res.redirect('/genre');
        }
    });
});

/*
// Delete a genre
router.post('/delete/:id', (req, res) => {
    const sql = `DELETE FROM genres WHERE genre_id = ?`;
    const params = [req.params.id];

    db.run(sql, params, (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).send("Internal Server Error");
        } else {
            res.redirect('/genre');
        }
    });
});
*/
module.exports = router;
