const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment.model");
const Post = require("../models/Post.model");

router.post("/create", async (req, res, next) => {
  let toSave = {
    // ...req.body,
    content: req.body.content,
    postId: req.body.postId,
    userId: req.session.currentUser._id,
  };

  if (toSave.content == "" ) { 
    req.session.error = 'Comment cant be empty';
    res.redirect("/posts" );
    return 
  } 

  console.log(toSave);

  Comment.create(toSave).then((commnetRes) => {
    // Post.commments.push(commnetRes._id)

    Post.findByIdAndUpdate(commnetRes.postId, {
      $push: { comments: commnetRes._id },
    }).then((_) => {
      res.redirect("/posts");
    });
  });
});

// http://localhost:3000/comments/todos
router.get("/todos", async (req, res, next) => {
  Comment.find({}).then((data) => {
    res.send(data);
  });
});

//no se que pasa que no sale nada en coments!!!!!

// router.get("/", (req, res, next) => {
//   Post.find({}).then((data) => {
//     res.render("commments/list", { commments: data, userid: req.session.currentUser._id });
//   });
// });

// router.get("/edit/:id", (req, res, next) => {
//   Post.findById(req.params.id).then((data) => {
//     res.render("posts/edit", { post: data });
//   });
// });

// router.post("/update/:id", (req, res, next) => {
//   Post.findByIdAndUpdate(req.params.id, req.body).then((data) => {
//     res.redirect("/posts");
//   });
// });

// router.get("/delete/:id", (req, res, next) => {
//   Post.findByIdAndDelete(req.params.id).then((_) => {
//     res.redirect("/posts");
//   });
// });

module.exports = router;
