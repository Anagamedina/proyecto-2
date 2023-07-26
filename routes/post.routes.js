const express = require("express");
const router = express.Router();
const Post = require("../models/Post.model");
const isLoggedIn = require("../middleware/isLoggedIn");


/* GET home page */
router.get("/new", (req, res, next) => {
  res.render("posts/create");
});


router.post("/new", async (req, res, next) => {
  let toSave = {
    ...req.body,
    user: req.session.currentUser._id,
  };
  await Post.create(toSave);
  res.redirect("/posts");
});


router.get("/", isLoggedIn, (req, res, next) => { 
  Post.find({}).then((data) => { //arraydata
     
   //res.send(data)
   //return 
    data.map(post=>{   
      post.esMiPost = (post.user.toString()  == req.session.currentUser._id)
    })

    res.render("posts/list", { posts: data, userid: req.session.currentUser._id });
  });
});

router.get("/my", isLoggedIn, (req, res, next) => { 
  Post.find({user: req.session.currentUser._id}).then((data) => { 
    res.render("posts/list", { posts: data, userid: req.session.currentUser._id });
  });
});


router.get("/edit/:id", (req, res, next) => {
  Post.findById(req.params.id).then((data) => {
    res.render("posts/edit", { post: data });
  });
});


router.post("/update/:id", (req, res, next) => {
  Post.findByIdAndUpdate(req.params.id, req.body).then((data) => {
    res.redirect("/posts");
  });
});


router.get("/delete/:id", (req, res, next) => {
  Post.findByIdAndDelete(req.params.id).then((_) => {
    res.redirect("/posts");
  });
});


module.exports = router;
