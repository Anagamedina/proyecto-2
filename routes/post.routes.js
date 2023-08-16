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
  Post.find({})
    .populate({
      path: 'comments',
      populate: {
        path: 'userId'
      }
    })
    .then((data) => {
      try {
        data.map(post => {
          post.esMiPost = (post.user.toString() == req.session.currentUser._id);
          post.comments.map(comment => {
            try {
              comment.esMio = (comment.userId && comment.userId._id.toString() == req.session.currentUser._id) || req.session.currentUser.role == 'admin';
            } catch (error) {
              
            }
          });
        });
        //post.comments.map(comment=>{ 
        //  comment.esMio = (comment.userId?._id.toString()  == req.session.currentUser._id) ||   req.session.currentUser.role == 'admin'
        //})
        
        res.render("posts/list", { posts: data, userid: req.session.currentUser._id, error: req.session.error });
        delete req.session.error;
      } catch (error) {
        
        next(error); 
      }
    })
    .catch(next); 
});

//JSON 
router.get("/json", isLoggedIn, (req, res, next) => { 
  Post.find({}).populate("comments").then((data) => { 
     res.send(data)  
  });
});

router.get("/my", isLoggedIn, (req, res, next) => { 
  Post.find({user: req.session.currentUser._id}).then((data) => { 
    data.map(post=>{   
      post.esMiPost = true;
    })
    res.render("posts/list", { posts:  data, userid: req.session.currentUser._id });
  });
});

// READ de un único post
router.get("/:id", (req, res, next) => { 
  Post.findById(req.params.id) 
    .populate({
      path: "comments", 
      populate: {
        path: "userId",
      },
    })
    .then((data) => {
      console.log(data);
      let editable = false;
      try {
        if (data && data.user) {
          const userIdString = data.user.toString();
          if (userIdString === req.session.currentUser._id || req.session.currentUser.role === 'admin') {
            editable = true;
          }
        }
      } catch (error) {
        
      }
      res.render("posts/viewOne", { post: data, editable: editable });
    });
    //let editable = (data?.user?.toString() == req.session.currentUser._id) || req.session.currentUser.role == 'admin'
});
//EDITAR una ruta especifica 
router.get("/:id/edit", (req, res, next) => {
  Post.findById(req.params.id).then((data) => {
    res.render("posts/edit", { post: data });
  });
});

//Actualizacion publicacion especifica 
router.post("/:id/edit", (req, res, next) => {
  Post.findByIdAndUpdate(req.params.id, req.body).then((data) => {
    res.redirect("/posts");
  });
});
 
//DELETE
router.get("/:id/delete", (req, res, next) => {
  Post.findByIdAndDelete(req.params.id).then(() => {
    res.redirect("/posts");
  });
});


//LIKES 

router.post("/:id/like", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send("Publicación no encontrada");
    }

    // Verifica si el usuario ya le dio "Me gusta" y agrega o quita según corresponda
    if (post.likes.includes(req.session.currentUser._id)) {
      post.likes.pull(req.session.currentUser._id);
    } else {
      post.likes.push(req.session.currentUser._id);
    }

    await post.save();
    res.redirect("/posts/"+req.params.id); //+?
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al procesar la solicitud");
  }
});


module.exports = router;
