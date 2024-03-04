const express = require("express");
const router = express.Router();
const {
  Users,
  Carts,
  CartProducts,
  GatheringParticipants,
  Gatherings,
} = require("../models");
const bcrypt = require("bcrypt");
const { createTokens, validateToken } = require("../JWT");

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await Users.findOne({ where: { email: email } });
  if (existingUser) {
    return res.status(400).json({ error: "Email already exists" });
  }
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      Users.create({
        name: name,
        email: email,
        password: hash,
      });
      newUser = Users.findOne({ where: { email: email } });
      console.log(newUser.email);
      res.json("User Registered Successfully !");
    })
    .catch((err) => {
      if (err) {
        res.status(400).json({ error: err.message });
      }
    });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await Users.findOne({ where: { email: email } });

  if (!user) {
    res.status(400).json({ error: "User is not Found !" });
  } else {
    bcrypt.compare(password, user.password).then((match) => {
      if (!match) {
        res.status(400).json({ error: "Wrong Email And Password Combination" });
      } else {
        const accessToken = createTokens(user);
        res.cookie("access-token", accessToken, {
          maxAge: 60 * 60 * 24 * 30 * 1000,
          httpOnly: true,
        });
        res.json({ accessToken: accessToken });
      }
    });
  }
});

router.get("/auth", validateToken, (req, res) => {
  res.json({ auth: true });
});

router.get("/logout", (req, res) => {
  res.clearCookie("access-token");
  res.json({ message: "Logged Out" });
});

router.get("/cart", validateToken, async (req, res) => {
  const cart = await Carts.findOne({ where: { userId: req.user.id } });
  const cartItems = await CartProducts.findAll({ where: { cartId: cart.id } });
  res.json(cartItems);
});

router.post("/cart", validateToken, async (req, res) => {
  const { itemId } = req.body;

  const cart = await Carts.findOne({ where: { userId: req.user.id } });
  CartProducts.create({
    cartId: cart.id,
    productId: itemId,
  });
  res.json("Product added to cart");
});

router.delete("/cart/:id", validateToken, async (req, res) => {
  const { id } = req.params;
  await CartProducts.destroy({ where: { id: id } });
  res.json("Product removed from cart");
});

// delete request to clear the cart
router.delete("/cart", validateToken, async (req, res) => {
  const cart = await Carts.findOne({ where: { userId: req.user.id } });
  await CartProducts.destroy({ where: { cartId: cart.id } });
  res.json("Cart Cleared");
});

// put request to update the quantity of a product in the cart
router.put("/cart", validateToken, async (req, res) => {
  const { productId, quantity } = req.body;
  await CartProducts.update({ quantity }, { where: { productId: productId } });
  res.json("Quantity Updated");
});

//post request to enroll in a gathering
router.post("/enroll", validateToken, async (req, res) => {
  const { gatheringId } = req.body;
  const user = await Users.findOne({ where: { id: req.user.id } });
  const gathering = await Gatherings.findOne({ where: { id: gatheringId } });
  if (!gathering) {
    return res.json({ error: "Gathering does not exist" });
  }
  const alreadyEnrolled = await GatheringParticipants.findOne({
    where: { gatheringId: gatheringId, userId: user.id },
  });
  if (alreadyEnrolled) {
    return res
      .status(405)
      .json({ error: "You are already enrolled in this gathering" });
  }
  GatheringParticipants.create({
    gatheringId: gatheringId,
    userId: user.id,
  });
  res.json("Enrolled Successfully");
});

//delete request to unenroll from a gathering
router.delete("/unenroll/:gatheringId", validateToken, async (req, res) => {
  const { gatheringId } = req.params;
  const user = await Users.findOne({ where: { id: req.user.id } });
  const gathering = await Gatherings.findOne({ where: { id: gatheringId } });
  if (!gathering) {
    return res.json({ error: "Gathering does not exist" });
  }
  const alreadyEnrolled = await GatheringParticipants.findOne({
    where: { gatheringId: gatheringId, userId: user.id },
  });
  if (!alreadyEnrolled) {
    return res
      .status(405)
      .json({ error: "You are not enrolled in this gathering" });
  }
  await GatheringParticipants.destroy({
    where: { gatheringId: gatheringId, userId: user.id },
  });
  res.json("Unenrolled Successfully");
});

// get rquest to fetch all user partticipations
router.get("/participations", validateToken, async (req, res) => {
  const user = await Users.findOne({ where: { id: req.user.id } });
  const participations = await GatheringParticipants.findAll({
    where: { userId: user.id },
  });
  res.json(participations);
});

module.exports = router;
