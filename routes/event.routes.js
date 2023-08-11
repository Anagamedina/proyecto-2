const express = require("express");
const router = express.Router();
const Event = require("../models/Event.model");
const isLoggedIn = require("../middleware/isLoggedIn");

// Ruta para mostrar el formulario de creación de eventos
router.get("/new", isLoggedIn, (req, res, next) => {
  res.render("events/create");
});

// Ruta para procesar la creación de un nuevo evento
router.post("/new", isLoggedIn, async (req, res, next) => {
  const { title, description, location, date } = req.body;
  const newEvent = new Event({
    title,
    description,
    location,
    date,
    creator: req.session.currentUser._id,
  });
  await newEvent.save();
  res.redirect("/events");
});

module.exports = router;
