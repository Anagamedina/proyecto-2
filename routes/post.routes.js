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
  Post.find({}).populate("comments").then((data) => { //arraydata //devuelve las instancias de Post 
     
  //  res.send(data)
  //  return 
    data.map(post=>{   
      post.esMiPost = (post.user.toString()  == req.session.currentUser._id)
    })

    res.render("posts/list", { posts: data, userid: req.session.currentUser._id, error: req.session.error });
    delete req.session.error  
  });
});
//ENDPOINT 
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
    res.redirect("/posts");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al procesar la solicitud");
  }
});


module.exports = router;
