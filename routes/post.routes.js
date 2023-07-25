const express = require("express");
const router = express.Router();
const Post = require("../models/Post.model");

/* GET home page */

// GET/posts
router.get("/", (req, res, next) => {
  res.send("Estamos en /posts")
})

// GET /posts/new
router.get("/new", (req, res, next) => {
  res.render("posts/create");
});

// POST /posts/new
router.post("/create", async (req, res, next) => {
  let toSave = {
    ...req.body,
    user: req.session.currentUser._id, //agregamos una propiedad
  };
  await Post.create(toSave);
  res.redirect("/posts");
});




module.exports = router;
