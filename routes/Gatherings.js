const express = require("express");
const router = express.Router();
const PASSWORD = process.env.PASSWORD;
// Model
const { Gatherings, Users, GatheringParticipants } = require("../models");

// Get all gatherings
router.get("/", async (req, res) => {
  try {
    const gatherings = await Gatherings.findAll();
    res.json(gatherings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single gathering
router.get("/:id", getGathering, (req, res) => {
  res.json(res.gathering);
});

// Create a gathering
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

    const newgathering = await Gatherings.create({
      title: title,
      date: date,
      description: description,
      image: image,
    });
    res.status(201).json(newgathering);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// // Update a gathering
// router.patch("/:id", getGathering, async (req, res) => {
//   if (req.body.title != null) {
//     res.gathering.title = req.body.title;
//   }
//   if (req.body.date != null) {
//     res.gathering.date = req.body.date;
//   }
//   if (req.body.description != null) {
//     res.gathering.description = req.body.description;
//   }

//   try {
//     const updatedgathering = await res.gathering.save();
//     res.json(updatedgathering);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// Delete a gathering
router.delete("/:password/:id", getGathering, async (req, res) => {
  const { password } = req.params;
  if (password !== PASSWORD) {
    return res.status(401).json({
      message: "Unauthirzed",
    });
  }

  await res.gathering
    .destroy()
    .then(() => {})
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
  res.json({ message: "gathering deleted" });
});

// get all participants of a gathering
router.get("/:id/participants", async (req, res) => {
  try {
    const participants = await GatheringParticipants.findAll({
      where: { gatheringId: req.params.id },
      include: Users,
    });
    res.json(participants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get a single gathering by ID
async function getGathering(req, res, next) {
  let gathering;
  try {
    gathering = await Gatherings.findByPk(req.params.id);
    if (gathering == null) {
      return res.status(404).json({ message: "gathering not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.gathering = gathering;
  next();
}

module.exports = router;
