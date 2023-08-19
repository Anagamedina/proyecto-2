const express = require("express");
const router = express.Router();
const Event = require("../models/Event.model");
const isLoggedIn = require("../middleware/isLoggedIn");


//Formulario de creación de eventos
router.get("/new", isLoggedIn, (req, res, next) => {
  res.render("events/create");
});

// Ruta para procesar la creación de un nuevo evento
router.post("/new", isLoggedIn, async (req, res, next) => {
  const toSave = {
    ...req.body,
    creator: req.session.currentUser._id,
  };
  await Event.create(toSave);
  res.redirect("/events");
});

router.get("/", isLoggedIn, (req, res, next) => {
  Event.find({}).populate("invited").then((data) => {
    data.map(event=>{
      if(event && event.creator) {  
        event.editable = (event.creator._id.toString()  == req.session.currentUser._id) ||   req.session.currentUser.role == 'admin'
      }
    })

    res.render("events/list", { events: data });
  });
});



// READ de un único post// nuevo hoy 
router.get("/:id", (req, res, next) => { 
  Event.findById(req.params.id) 
    .populate({
      path: "invited", 
    })
    .then((data) => {
      console.log(data);
      if (data && data.creator) { 
        let editable = (data.creator._id.toString() == req.session.currentUser._id) || req.session.currentUser.role == 'admin'
      }
      res.render("events/list", { events: data, editable: editable });
    });
    
});


//Usuario actual se agruegue como invitado a un evento 
router.post("/addMe", isLoggedIn, (req, res, next) => {
  const { eventId } = req.body; //const eventId= req.body.eventId;

  Event.findByIdAndUpdate(eventId, {
    $addToSet : { invited: req.session.currentUser._id }, //push no funciona duplica 
  }).then(() => {
    res.redirect("/events");
  });
  // res.render("events/create");
});



//EDITAR una ruta especifica 
router.get("/:id/edit", (req, res, next) => {
  Event.findById(req.params.id).then((data) => {
    res.render("events/edit", { events: data });
  });
});

//Actualizacion publicacion especifica 
router.post("/:id/edit", (req, res, next) => {
  Event.findByIdAndUpdate(req.params.id, req.body).then((data) => {
    res.redirect("/events");
  });
});

//Actualizacion publicacion especifica 
router.post("/:id/edit", (req, res, next) => {
  Event.findByIdAndUpdate(req.params.id, req.body).then(() => {
    res.redirect(`/events/${req.params.id}`); // Redirige a la página de detalles del evento
  });
});

router.get("/:id/delete", (req, res, next) => {
  Event.findByIdAndDelete(req.params.id).then(() => {
    res.redirect("/events");
  });
});

module.exports = router;
