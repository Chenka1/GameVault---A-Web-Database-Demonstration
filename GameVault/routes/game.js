const express = require('express');
const router = express.Router();
const db = require('../db');

// List all games
router.get('/', (req, res) => {
    const sql = `SELECT * FROM games`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send("Internal Server Error");
        } else {
            // Pass the rows as 'games' to the template
            res.render('gameView', { title: 'Game List', games: rows });
        }
    });
});


// Render the new game form
router.get('/new', (req, res) => {
    res.render('gameNew', { title: 'New Game', User: req.session.user });
});

// Add a new game
router.post('/new', (req, res) => {
    const sql = `INSERT INTO games (title, price, age_rating, link) VALUES (?, ?, ?, ?)`;
    const params = [req.body.gtitle, req.body.gprice, req.body.gamerating, req.body.glink];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(500).send("Server internal error");
        } else {
            res.redirect(301, '/');
        }
    });
});

// Route to fetch a specific game and render the update form
router.get('/:id', (req, res) => {
    const sql = `SELECT * FROM games WHERE game_id = ?`;
    const params = [req.params.id];

    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(500).send("Internal Server Error");
        } else if (!row) {
            res.status(404).send("Game not found.");
        } else {
            res.render('gameUpdate', { title: 'Update Game', game: row });
        }
    });
});



// Update a game
router.post('/update', (req, res) => {
    const sql = `UPDATE games SET title = ?, price = ?, age_rating = ?, link = ? WHERE game_id = ?`;
    const params = [req.body.gtitle, req.body.gprice, req.body.gamerating, req.body.glink, req.body.gid];

    db.run(sql, params, (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).send("Internal Server Error");
        } else {
            res.redirect(301, '/game');
        }
    });
});

/*
// Delete a game
router.post('/delete/:id', (req, res) => {
    const sql = `DELETE FROM games WHERE game_id = ?`;
    const params = [req.params.id];

    db.run(sql, params, (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).send("Internal Server Error");
        } else {
            res.redirect(301, '/game');
        }
    });
});
*/
module.exports = router;
