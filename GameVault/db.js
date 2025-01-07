const sqlite3 = require("sqlite3").verbose()
const path = require("path")

const dbfile = path.join(__dirname, "games.db")

const db = new sqlite3.Database(dbfile, (err) => {
    if (err) {
        console.error(err.message)
        throw err
    } else {
        console.log("Connected to the Game database.")
    }
})

module.exports = db
