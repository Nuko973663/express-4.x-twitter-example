var express = require("express");
var router = express.Router();
var db = require("../db");

/* GET home page. */
router.get("/", function (req, res, next) {
  let role;
  let address;
  console.log(req.user);
  if (req.user) {
    db.serialize(() => {
      db.get(
        "select * from list where username like ?",
        req.user.username,
        (err, item) => {
          address = item;
          console.log(address);
        }
      );
      db.get(
        "select * from role where username like ?",
        req.user.username,
        (err, item) => {
          role = item;
          console.log(role);
          res.render("index", {
            user: req.user,
            role: role,
            address: address.address,
          });
        }
      );
    });
  } else {
    res.render("index", { user: req.user, role: role });
  }
});

module.exports = router;
