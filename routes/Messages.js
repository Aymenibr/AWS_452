const express = require("express");
const router = express.Router();
const { Messages } = require("../models");

const PASSWORD = process.env.PASSWORD;

router.get("/:password", async (req, res) => {
  const { password } = req.params;
  if (password !== PASSWORD) {
    return res.status(401).json({
      message: "Unauthirzed",
    });
  }
  const listOfMessages = await Messages.findAll();
  res.json(listOfMessages);
});

router.post("/", async (req, res) => {
    const { name, email, text} = req.body;    
  try {
    if(!name || !email || !text){
        return res.status(400).json({ error: "Please fill all the fields" });
    }
      const newRequest = await Messages.create({
          name,
          email,
          text,
        
      });
      res.json(newRequest);
  } catch (error) {
      res.status(500).json({ error: "Failed to send a message" });
  }
});

module.exports = router;