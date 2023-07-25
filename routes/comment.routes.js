const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment.model");
 
router.post("/create", async (req, res, next) => {
  let toSave = {
    ...req.body,
    userId: req.session.currentUser._id,
 };
  res.send(toSave)
 
   await Post.create(toSave);
   res.redirect("/posts");
});


///////////////////////////////////////////////

//router.post("/create", (req, res, next) => {
//  const { content } = req.body;
//  const userId = req.session.currentUser._id;


//  Comment.create({ content, userId })
//    .then((newComment) => {
//      res.send(newComment); 
//    })
//    .catch((err) => {
//      res.status(500).send("Error al crear el comentario.");
//    });
//});










//////////////////////////////////////7






// router.get("/", (req, res, next) => {
//   Post.find({}).then((data) => {
//     res.render("posts/list", { posts: data, userid: req.session.currentUser._id });
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




