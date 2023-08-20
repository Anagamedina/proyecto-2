const express = require('express');
const router = express.Router();
const isLoggedIn = require("../middleware/isLoggedIn");

/* GET home page */
router.get("/", isLoggedIn, (req, res, next) => {
  res.redirect("/posts") 
});

router.get("/select" , (req, res, next) => {
  res.render("select") 
});

module.exports = router;
