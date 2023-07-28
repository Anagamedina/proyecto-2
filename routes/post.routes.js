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
  Post.find({}).populate("comments").then((data) => { //arraydata
     
  //  res.send(data)
  //  return 
    data.map(post=>{   
      post.esMiPost = (post.user.toString()  == req.session.currentUser._id)
    })

    res.render("posts/list", { posts: data, userid: req.session.currentUser._id, error: req.session.error });
    delete req.session.error  
  });
});

router.get("/json", isLoggedIn, (req, res, next) => { 
  Post.find({}).populate("comments").then((data) => { //arraydata 
     res.send(data)  
  });
});

router.get("/my", isLoggedIn, (req, res, next) => { 
  Post.find({user: req.session.currentUser._id}).then((data) => { 
    data.map(post=>{   
      post.esMiPost = true;
    })
    res.render("posts/list", { posts: data, userid: req.session.currentUser._id });
  });
});

// READ de un único post
router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).populate("comments").then((data) => {
    res.render("posts/viewOne", { post: data });
  });
})

router.get("/:id/edit", (req, res, next) => {
  Post.findById(req.params.id).then((data) => {
    res.render("posts/edit", { post: data });
  });
});


router.post("/:id/edit", (req, res, next) => {
  Post.findByIdAndUpdate(req.params.id, req.body).then((data) => {
    res.redirect("/posts");
  });
});
 

router.get("/:id/delete", (req, res, next) => {
  Post.findByIdAndDelete(req.params.id).then((_) => {
    res.redirect("/posts");
  });
});


//crear populate en todas las rutas de get post con los comentarios
//comentarios [y autor]

module.exports = router;
