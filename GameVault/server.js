const express = require('express')
const path = require('path')
const session = require('express-session')
const db = require('./db')

const indexRoute = require('./routes/index')
const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')
const gameRoute = require('./routes/game')
const pubRoute = require('./routes/publisher')
const devRoute = require('./routes/developer')
const reviewRoute = require('./routes/review')
const genreRouter = require('./routes/genre');

const app = express()
const port = process.env.PORT || 3000

// view engine setup
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

//middleware
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded())
app.use(express.json())
app.use(session({
    secret: 'KuqaG+gQPSCg/XULJxhHAj8575LLqOI3Aixp/FF32VvzA+zrALqpf2/O',
    resave: false,
    saveUninitialized: false
}))

app.use('/', indexRoute)
app.use('/auth', authRoute)

//Authentication test
const isAuth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/auth/login')
    }
}



app.use(isAuth)
app.use('/user', userRoute)
app.use('/game', gameRoute)
app.use('/publisher', pubRoute)
app.use('/developer', devRoute)
app.use('/review', reviewRoute)
app.use('/genre', genreRouter)

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
})

// Add a search route to handle search requests
app.get('/search', (req, res) => {
    const { query, category } = req.query;

    let sql, labels;
    switch (category) {
        case 'games':
            sql = `SELECT title AS Name, price AS Price, age_rating AS 'Age Rating', link AS Link FROM games WHERE title LIKE ?`;
            labels = ['Name', 'Price', 'Age Rating', 'Link'];
            break;
        case 'publishers':
            sql = `SELECT name AS Name, location AS Location FROM publishers WHERE name LIKE ?`;
            labels = ['Name', 'Location'];
            break;
        case 'developers':
            sql = `SELECT name AS Name, location AS Location, website AS Website FROM developers WHERE name LIKE ?`;
            labels = ['Name', 'Location', 'Website'];
            break;
        case 'genres':
            sql = `SELECT name AS Name FROM genres WHERE name LIKE ?`;
            labels = ['Name'];
            break;
        default:
            res.status(400).send('Invalid category');
            return;
    }

    db.all(sql, [`%${query}%`], (err, rows) => {
        if (err) {
            res.status(500).send('Internal Server Error');
        } else {
            res.render('home', { title: 'Home', results: rows, labels });
        }
    });
});



app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
