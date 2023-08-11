const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment.model");
const Post = require("../models/Post.model");

//creacion comentario post especifico 
router.post("/create", async (req, res, next) => {
  let toSave = {
    // ...req.body, remmember
    content: req.body.content,
    postId: req.body.postId,
    userId: req.session.currentUser._id,
  };
//comentarios vacios 
  if (toSave.content == "" ) { 
    req.session.error = 'Comment cant be empty';
    res.redirect("/posts" );
    return 
  } 

  Comment.create(toSave).then((commnetRes) => {
    // Post.commments.push(commnetRes._id)

    Post.findByIdAndUpdate(commnetRes.postId, {
      $push: { comments: commnetRes._id },
    }).then(() => {
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


module.exports = router;
