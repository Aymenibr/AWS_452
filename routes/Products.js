const express = require("express");
const router = express.Router();
const PASSWORD = process.env.PASSWORD;
// Model
const { Products } = require("../models");

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Products.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single product
router.get("/:id", getProduct, (req, res) => {
  res.json(res.product);
});

// Create a product
router.post("/:password", async (req, res) => {
  const { password } = req.params;
  if (password !== PASSWORD) {
    return res.status(401).json({
      message: "Unauthirzed",
    });
  }
  const { name, price, description, image } = req.body;

  try {
    if (!name || !price || !description || !image) {
      return res.status(400).json({ error: "Please fill all the fields" });
    }

    const newProduct = await Products.create({
      name: name,
      price: price,
      description: description,
      image: image,
    });
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a product
router.delete("/:password/:id", getProduct, async (req, res) => {
  const { password } = req.params;
  if (password !== PASSWORD) {
    return res.status(401).json({
      message: "Unauthirzed",
    });
  }

  await res.product
    .destroy()
    .then(() => {})
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
  res.json({ message: "Product deleted" });
});

// Middleware to get a single product by ID
async function getProduct(req, res, next) {
  let product;
  try {
    product = await Products.findByPk(req.params.id);
    if (product == null) {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.product = product;
  next();
}

module.exports = router;
