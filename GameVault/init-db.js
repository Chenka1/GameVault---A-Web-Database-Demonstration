const sqlite3 = require("sqlite3").verbose();
const md5 = require("md5");

// Connect to the SQLite database
const db = new sqlite3.Database("./games.db", (err) => {
  if (err) {
    return console.error("Error connecting to the database:", err.message);
  }
  console.log("Connected to the Game database.");
});

// Helper function to drop and recreate tables sequentially
const recreateTable = (dropQuery, createQuery) => {
  return new Promise((resolve, reject) => {
    db.run(dropQuery, (err) => {
      if (err) {
        console.error("Error dropping table:", err.message);
        return reject(err);
      }
      db.run(createQuery, (err) => {
        if (err) {
          console.error("Error creating table:", err.message);
          return reject(err);
        }
        resolve();
      });
    });
  });
};

// Helper function to insert data
const insertData = (insertQuery, params) => {
    return new Promise((resolve, reject) => {
      db.run(insertQuery, params, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  };

// Main function to initialize the database
(async () => {
  try {
    await recreateTable(
      `DROP TABLE IF EXISTS games`,
      `CREATE TABLE games (
        game_id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        price REAL,
        age_rating INTEGER,
        link TEXT
      )`
    );
    console.log("Table 'games' created.");

    await recreateTable(
      `DROP TABLE IF EXISTS users`,
      `CREATE TABLE users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_name TEXT NOT NULL,
        password TEXT NOT NULL,
        email TEXT UNIQUE,
        CONSTRAINT email_unique UNIQUE (email)
      )`
    );
    console.log("Table 'users' created.");
    
    // Insert admin user
    const insertAdmin = `INSERT INTO users (user_name, password, email) VALUES (?, ?, ?)`;
    db.run(insertAdmin, ["admin", md5("admin123"), "admin@games.ca"], (err) => {
      if (err) console.error("Error inserting admin user:", err.message);
      else console.log("Admin user created.");
    });

    await recreateTable(
      `DROP TABLE IF EXISTS publishers`,
      `CREATE TABLE publishers (
        publisher_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        location TEXT
      )`
    );
    console.log("Table 'publishers' created.");

    await recreateTable(
      `DROP TABLE IF EXISTS developers`,
      `CREATE TABLE developers (
        developer_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        location TEXT,
        website TEXT
      )`
    );
    console.log("Table 'developers' created.");

    await recreateTable(
      `DROP TABLE IF EXISTS genres`,
      `CREATE TABLE genres (
        genre_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      )`
    );
    console.log("Table 'genres' created.");

    await recreateTable(
      `DROP TABLE IF EXISTS reviews`,
      `CREATE TABLE reviews (
        review_id INTEGER,
        user_id INTEGER NOT NULL,
        game_id INTEGER NOT NULL,
        rating INTEGER,
        comment TEXT,
        PRIMARY KEY (review_id, user_id),
        FOREIGN KEY (user_id) REFERENCES users(user_id),
        FOREIGN KEY (game_id) REFERENCES games(game_id)
      )`
    );
    console.log("Table 'reviews' created.");

    await recreateTable(
      `DROP TABLE IF EXISTS published_by`,
      `CREATE TABLE published_by (
        publisher_id INTEGER NOT NULL,
        game_id INTEGER NOT NULL,
        release_date TEXT,
        PRIMARY KEY (publisher_id, game_id),
        FOREIGN KEY (publisher_id) REFERENCES publishers(publisher_id),
        FOREIGN KEY (game_id) REFERENCES games(game_id)
      )`
    );
    console.log("Table 'published_by' created.");

    await recreateTable(
      `DROP TABLE IF EXISTS developed_by`,
      `CREATE TABLE developed_by (
        game_id INTEGER NOT NULL,
        developer_id INTEGER NOT NULL,
        PRIMARY KEY (game_id, developer_id),
        FOREIGN KEY (developer_id) REFERENCES developers(developer_id),
        FOREIGN KEY (game_id) REFERENCES games(game_id)
      )`
    );
    console.log("Table 'developed_by' created.");

    await recreateTable(
      `DROP TABLE IF EXISTS game_genres`,
      `CREATE TABLE game_genres (
        game_id INTEGER NOT NULL,
        genre_id INTEGER NOT NULL,
        PRIMARY KEY (game_id, genre_id),
        FOREIGN KEY (game_id) REFERENCES games(game_id),
        FOREIGN KEY (genre_id) REFERENCES genres(genre_id)
      )`
    );
    console.log("Table 'game_genres' created.");

    await insertData(
        `INSERT INTO games (title, price, age_rating, link) VALUES (?, ?, ?, ?)`,
        ["Cyberpunk 2077", 59.99, 17, "https://store.steampowered.com/app/1091500/Cyberpunk_2077/"]
    );
    await insertData(
        `INSERT INTO games (title, price, age_rating, link) VALUES (?, ?, ?, ?)`,
        ["The Legend of Zelda: Breath of the Wild", 59.99, 10, "https://zelda.com"]
    );
    await insertData(
        `INSERT INTO games (title, price, age_rating, link) VALUES (?, ?, ?, ?)`,
        ["Grand Theft Auto V", 29.99, 17, "https://store.steampowered.com/app/271590/Grand_Theft_Auto_V/"]
    );
    await insertData(
        `INSERT INTO games (title, price, age_rating, link) VALUES (?, ?, ?, ?)`,
        ["Elden Ring", 79.99, 17, "https://store.steampowered.com/app/1245620/ELDEN_RING/"]
    );
    await insertData(
        `INSERT INTO games (title, price, age_rating, link) VALUES (?, ?, ?, ?)`,
        ["Minecraft", 29.99, 10, "https://minecraft.net"]
    );
    await insertData(
        `INSERT INTO games (title, price, age_rating, link) VALUES (?, ?, ?, ?)`,
        ["Red Dead Redemption 2", 79.99, 17, "https://store.steampowered.com/app/1174180/Red_Dead_Redemption_2/"]
    );
    await insertData(
        `INSERT INTO games (title, price, age_rating, link) VALUES (?, ?, ?, ?)`,
        ["Apex Legends", 0, 13, "https://store.steampowered.com/app/1172470/Apex_Legends/"]
    );
    await insertData(
        `INSERT INTO games (title, price, age_rating, link) VALUES (?, ?, ?, ?)`,
        ["Among Us", 6.49, 10, "https://store.steampowered.com/app/945360/Among_Us/"]
    );
    await insertData(
        `INSERT INTO games (title, price, age_rating, link) VALUES (?, ?, ?, ?)`,
        ["Call of Duty: Warzone", 0, 17, "https://store.steampowered.com/app/1962663/Call_of_Duty_Warzone/"]
    );
    await insertData(
        `INSERT INTO games (title, price, age_rating, link) VALUES (?, ?, ?, ?)`,
        ["Stardew Valley", 16.99, 10, "https://store.steampowered.com/app/413150/Stardew_Valley/"]
    );
    await insertData(
        `INSERT INTO games (title, price, age_rating, link) VALUES (?, ?, ?, ?)`,
        ["Undertale", 10.99, 10, "https://store.steampowered.com/app/391540/Undertale/"]
    );
    await insertData(
        `INSERT INTO games (title, price, age_rating, link) VALUES (?, ?, ?, ?)`,
        ["Call of Duty: Black Ops 6", 89.99, 17, "https://store.steampowered.com/app/2933620/Call_of_Duty_Black_Ops_6/"]
    );
    await insertData(
        `INSERT INTO games (title, price, age_rating, link) VALUES (?, ?, ?, ?)`,
        ["Fortnite", 0, 13, "https://fortnite.com"]
    );
    await insertData(
        `INSERT INTO games (title, price, age_rating, link) VALUES (?, ?, ?, ?)`,
        ["Battlefield 2042", 79.99, 17, "https://store.steampowered.com/app/1517290/Battlefield_2042/"]
    );
    await insertData(
        `INSERT INTO games (title, price, age_rating, link) VALUES (?, ?, ?, ?)`,
        ["Valorant", 0, 13, "https://playvalorant.com"]
    );
    await insertData(
        `INSERT INTO games (title, price, age_rating, link) VALUES (?, ?, ?, ?)`,
        ["League of Legends", 0, 13, "https://www.leagueoflegends.com/en-us/"]
    );
    await insertData(
        `INSERT INTO games (title, price, age_rating, link) VALUES (?, ?, ?, ?)`,
        ["Genshin Impact", 0, 13, "https://genshin.mihoyo.com/en"]
    );
    await insertData(
        `INSERT INTO games (title, price, age_rating, link) VALUES (?, ?, ?, ?)`,
        ["Honkai Star Rail", 0, 13, "https://hsr.hoyoverse.com/en-us/"]
    );
    await insertData(
        `INSERT INTO games (title, price, age_rating, link) VALUES (?, ?, ?, ?)`,
        ["The Last of Us", 79.99, 17, "https://store.steampowered.com/app/1888930/The_Last_of_Us_Part_I/"]
    );
    await insertData(
        `INSERT INTO games (title, price, age_rating, link) VALUES (?, ?, ?, ?)`,
        ["Super Smash Bros. Ultimate", 59.99, 10, "https://smashbros.nintendo.com"]
    );
    
    const genres = [
        ["Action"], ["Adventure"], ["Role Playing"], ["First Person Shooter"], ["Simulation"],
        ["Strategy"], ["Sports"], ["Multiplayer"], ["Platformer"], ["Horror"],  ["Singleplayer"]
    ];
    for (const genre of genres) {
        await insertData(`INSERT INTO genres (name) VALUES (?)`, genre);
    }

    const gameGenres = [
        [1, 1],[1, 3],[2, 2],[2, 3], [3, 1],[3, 2],[4, 3],[4, 2],[5, 3],[5, 5],[6, 1],[6, 2],
        [7, 4],[7, 8],[8, 8],[8, 5],[9, 4], [10, 3], [10, 5], [11, 9], [12, 4],[13, 8],  
        [14, 4],[15, 4],[15, 8],[16, 8],[16, 3],[17, 3],[17, 2],[18, 3],[19, 2],[19, 10],[20, 8],
    ];
      
    for (const relation of gameGenres) {
        await insertData(`INSERT INTO game_genres (game_id, genre_id) VALUES (?, ?)`, relation);
    }

    const publishers = [
        ["CD Projekt Red", "Poland"], 
        ["Nintendo", "Japan"], 
        ["Rockstar Games", "USA"], 
        ["Bandai Namco", "Japan"], 
        ["Mojang", "Sweden"], 
        ["Epic Games", "USA"], 
        ["Innersloth", "USA"],
        ["Activision Blizzard", "USA"], 
        ["Concerned Ape", "USA"], 
        ["Toby Fox", "USA"],
        ["Electronic Arts", "USA"],
        ["Riot Games", "USA"],
        ["Mihoyo", "China"],
        ["Sony Computer Entertainment", "USA"]
      ];
    for (const publisher of publishers) {
        await insertData(`INSERT INTO publishers (name, location) VALUES (?, ?)`, publisher);
    }

    const publishedBy = [
        [1, 1, "2020-12-10"],
        [2, 2, "2017-03-03"], 
        [3, 3, "2013-09-17"],
        [4, 4, "2022-02-25"],
        [5, 5, "2011-11-18"],
        [6, 3, "2018-10-26"],
        [7, 11, "2019-02-04"],
        [8, 7, "2018-06-15"],
        [9, 8, "2020-03-10"],
        [10, 9, "2016-02-26"],
        [11, 10, "2015-09-15"],
        [12, 8, "2024-10-25"],
        [13, 6, "2017-07-25"],
        [14, 11, "2021-11-19"],
        [15, 12, "2020-06-02"],
        [16, 12, "2009-10-27"],
        [17, 13, "2020-09-28"], 
        [18, 13, "2023-04-26"],
        [19, 14, "2013-06-14"],
        [20, 2, "2018-12-07"],
      ];
      for (const relation of publishedBy) {
        await insertData(
          `INSERT INTO published_by (game_id, publisher_id, release_date) VALUES (?, ?, ?)`,
          relation
        );
      }
    
    const developers = [
        ["CD Projekt Red", "Poland", "https://cdprojektred.com"],
        ["Nintendo", "Japan", "https://www.nintendo.com"],
        ["Rockstar North", "UK", "https://www.rockstarnorth.com/"],
        ["FromSoftware", "Japan", "https://www.fromsoftware.jp/ww/"],
        ["Mojang", "Sweden", "https://www.minecraft.net/en-us"],
        ["Rockstar Games", "USA", "https://www.rockstargames.com/"],
        ["Respawn Entertainment", "USA", "https://www.respawn.com/"],
        ["Innersloth", "USA", "https://www.innersloth.com/"],
        ["Raven Software", "USA", "http://ravensoftware.com/"],
        ["Infinity Ward", "USA", "http://www.infinityward.com/"],
        ["ConcernedApe", "USA", "https://twitter.com/concernedape?lang=en"],
        ["Toby Fox", "USA", "https://twitter.com/tobyfox?lang=en"],
        ["Treyarch", "USA", "https://www.treyarch.com/"],
        ["Epic Games", "USA", "https://www.epicgames.com"],
        ["DICE", "Sweden", "http://dice.se/"],
        ["Riot Games", "USA", "https://www.riotgames.com/en"],
        ["Mihoyo", "China", "https://mihoyo.com"],
        ["Naughty Dog", "USA", "https://www.naughtydog.com/"],
        ["Bandai Namco Studios", "Japan", "https://www.bandainamcostudios.com/en/"],
        ["Masahiro Sakurai", "Japan", "https://twitter.com/Sora_Sakurai"]
    ];
    for (const developer of developers) {
        await insertData(`INSERT INTO developers (name, location, website) VALUES (?, ?, ?)`, developer);
    }

    const developedBy = [
        [1, 1], 
        [2, 2], 
        [3, 3], 
        [4, 4],
        [5, 5],
        [6, 6],
        [7, 7],
        [8, 8],
        [9, 9],
        [9, 10],
        [10, 11],
        [11, 12],
        [12, 9], 
        [12, 13],
        [13, 14],
        [14, 15],
        [15, 16], 
        [16, 16],
        [17, 17],
        [18, 17],
        [19, 18],
        [20, 19],
        [20, 20]
    ];
      for (const relation of developedBy) {
        await insertData(
          `INSERT INTO developed_by (game_id, developer_id) VALUES (?, ?)`,
          relation
        );
    }

  } catch (error) {
    console.error("Error initializing database:", error);
  } finally {
    db.close((err) => {
      if (err) {
        console.error("Error closing the database:", err.message);
      } else {
        console.log("Database connection closed.");
      }
    });
  }
})();
