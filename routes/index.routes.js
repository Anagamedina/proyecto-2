const express = require('express');
const router = express.Router();
const isLoggedIn = require("../middleware/isLoggedIn");

/* GET home page */
router.get("/", isLoggedIn, (req, res, next) => {
  res.redirect("/posts")
  // res.send(req.session.currentUser || "usuario no logeado")
  //res.render("index");
});

module.exports = router;
