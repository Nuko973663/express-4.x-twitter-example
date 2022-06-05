var express = require("express");
var passport = require("passport");
var db = require("../db");

var router = express.Router();

router.get("/login", function (req, res, next) {
  res.render("login");
});

router.get("/login/federated/twitter.com", passport.authenticate("twitter"));

router.get(
  "/oauth/callback/twitter.com",
  passport.authenticate("twitter", {
    assignProperty: "federatedUser",
    failureRedirect: "/login",
  }),
  function (req, res, next) {
    console.log(req.federatedUser);
    db.get(
      "SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?",
      ["https://twitter.com", req.federatedUser.id],
      function (err, row) {
        if (err) {
          return next(err);
        }
        if (!row) {
          console.log("insert into ", [
            req.federatedUser.displayName,
            req.federatedUser.username,
          ]);
          db.run(
            "INSERT INTO users (name, username) VALUES (?, ?)",
            [req.federatedUser.displayName, req.federatedUser.username],
            function (err) {
              if (err) {
                return next(err);
              }

              var id = this.lastID;
              db.run(
                "INSERT INTO federated_credentials (provider, subject, user_id) VALUES (?, ?, ?)",
                ["https://twitter.com", req.federatedUser.id, id],
                function (err) {
                  if (err) {
                    return next(err);
                  }
                  var user = {
                    id: id.toString(),
                    displayName: req.federatedUser.displayName,
                    username: req.federatedUser.username,
                  };
                  req.login(user, function (err) {
                    if (err) {
                      return next(err);
                    }
                    res.redirect("/");
                  });
                }
              );
            }
          );
        } else {
          db.get(
            "SELECT rowid AS id, username, name FROM users WHERE rowid = ?",
            [row.user_id],
            function (err, row) {
              if (err) {
                return next(err);
              }

              // TODO: Handle undefined row.
              var user = {
                id: row.id.toString(),
                username: row.username,
                displayName: row.name,
              };
              req.login(user, function (err) {
                if (err) {
                  return next(err);
                }
                res.redirect("/");
              });
            }
          );
        }
      }
    );
  }
);

router.post("/regist", function (req, res, next) {
  console.log(req.body.address);
  if (req.body.address) {
    db.serialize(() => {
      db.run("INSERT OR IGNORE INTO list (username, address) VALUES (?, ?)", [
        req.user.username,
        req.body.address,
      ]);
      db.run(
        "UPDATE list SET address = ? WHERE username=?",
        [req.body.address, req.user.username],
        (err) => {
          res.redirect("/");
        }
      );
    });
  } else {
    res.redirect("/");
  }
});

router.get("/logout", function (req, res, next) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
