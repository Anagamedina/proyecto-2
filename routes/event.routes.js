const express = require("express");
const router = express.Router();
const Event = require("../models/Event.model");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/", isLoggedIn, (req, res, next) => {
  Event.find({}).populate("invited").then((data) => {

    res.render("events/list", { events: data });
  });
});

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

//Usuario actual se agruegue como invitado a un evento 
router.post("/addMe", isLoggedIn, (req, res, next) => {
  const { eventId } = req.body; //const eventId= req.body.eventId; ?

  Event.findByIdAndUpdate(eventId, {
    $addToSet : { invited: req.session.currentUser._id }, //push no funciona duplica 
  }).then(() => {
    res.redirect("/events");
  });
  // res.render("events/create");
});

module.exports = router;
