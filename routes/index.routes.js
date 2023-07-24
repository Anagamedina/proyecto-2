const express = require('express');
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.send(req.session.currentUser)
  // res.render("index");
});

module.exports = router;
