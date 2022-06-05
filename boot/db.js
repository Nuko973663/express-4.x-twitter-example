var db = require("../db");

module.exports = function () {
  db.serialize(function () {
    db.run(
      "CREATE TABLE IF NOT EXISTS users ( \
      username TEXT UNIQUE, \
      hashed_password BLOB, \
      salt BLOB, \
      name TEXT \
    )"
    );

    db.run(
      "CREATE TABLE IF NOT EXISTS list ( \
      username TEXT UNIQUE, \
      address TEXT \
    )"
    );

    db.run(
      "CREATE TABLE IF NOT EXISTS role ( \
      username TEXT UNIQUE, \
      admin INTEGER, \
      referee INTEGER\
    )"
    );

    db.run(
      "CREATE TABLE IF NOT EXISTS federated_credentials ( \
      provider TEXT NOT NULL, \
      subject TEXT NOT NULL, \
      user_id INTEGER NOT NULL, \
      PRIMARY KEY (provider, subject) \
    )"
    );

    db.run("INSERT or ignore INTO role VALUES ('nuko973663', 1, 1)");
  });

  //db.close();
};
