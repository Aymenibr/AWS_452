const express = require("express");
const router = express.Router();
const PASSWORD = process.env.PASSWORD;
// Model
const { Events } = require("../models");

// Get all events
router.get("/", async (req, res) => {
  try {
    const events = await Events.findAll();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single event
router.get("/:id", getEvent, (req, res) => {
  res.json(res.event);
});

// Create a event
router.post("/:password", async (req, res) => {
  const { password } = req.params;
  if (password !== PASSWORD) {
    return res.status(401).json({
      message: "Unauthirzed",
    });
  }
  const { title, date, description, image } = req.body;

  try {
    if (!title || !date || !description || !image) {
      return res.status(400).json({ error: "Please fill all the fields" });
    }

    const newevent = await Events.create({
      title: title,
      date: date,
      description: description,
      image: image,
    });
    res.status(201).json(newevent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// // Update a event
// router.patch("/:id", getEvent, async (req, res) => {
//   if (req.body.title != null) {
//     res.event.title = req.body.title;
//   }
//   if (req.body.date != null) {
//     res.event.date = req.body.date;
//   }
//   if (req.body.description != null) {
//     res.event.description = req.body.description;
//   }

//   try {
//     const updatedevent = await res.event.save();
//     res.json(updatedevent);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// Delete a event
router.delete("/:password/:id", getEvent, async (req, res) => {
  const { password } = req.params;
  if (password !== PASSWORD) {
    return res.status(401).json({
      message: "Unauthirzed",
    });
  }

  await res.event
    .destroy()
    .then(() => {})
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
  res.json({ message: "event deleted" });
});

// Middleware to get a single event by ID
async function getEvent(req, res, next) {
  let event;
  try {
    event = await Events.findByPk(req.params.id);
    if (event == null) {
      return res.status(404).json({ message: "event not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.event = event;
  next();
}

module.exports = router;
