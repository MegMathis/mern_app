const router = require("express").Router();
const User = require("../models/User");
const Drink = require("../models/Drink");

function isAuthenticated(req, res, next) {
  if (!req.session.user_id)
    return res.status(401).send({ error: "You must be logged in" });

  next();
}

// Get all drinks or get drinks based on search query
router.get("/drinks", async (req, res) => {
  let drinks;
  const search = req.params.query.search;

  if (search) {
    drinks = await Drink.find({
      $regex: search,
      $options: "i",
    }).populate({
      path: "user",
      select: "-password",
    });
  } else {
    drinks = await Drink.find().populate({
      path: "user",
      select: "-password",
    });
  }

  res.send(drinks);
});

// Get one drink by id
router.get("/drink/:id", async (req, res) => {
  const drink = await Drink.findById(req.params.id).populate({
    path: "user",
    select: "-password",
  });

  res.send({ drink: drink });
});

// Get favorite drinks for a user
router.get("/drinks/user", isAuthenticated, async (req, res) => {
  const user_id = req.session.user_id;

  const user = await User.findById(user_id).populate("favorites");

  res.send(user.favorites);
});

// Add a favorite drink to a user
router.put("/drink/:id", isAuthenticated, async (req, res) => {
  const drink_id = req.params.id;

  const drink = await Drink.findById(drink_id);

  if (!drink)
    return res.status(404).send({ error: "No drink found by that id." });

  try {
    await User.findOneAndUpdate(
      {
        _id: req.session.user_id,
      },
      {
        $addToSet: {
          favorites: drink._id,
        },
      }
    );

    res.send({ message: "Drink favorited successfully!" });
  } catch (err) {
    res.status(500).send({ error: err });
  }
});

// Delete a favorite for a user
router.put("/drink/:id", isAuthenticated, async (req, res) => {
  await User.findOneAndUpdate(
    {
      _id: req.session.user_id,
    },
    {
      $pull: {
        favorites: req.params.id,
      },
    }
  );

  res.send({ message: "Favorite removed successfully!" });
});

// Create a drink
router.post("/drink", isAuthenticated, async (req, res) => {
  const user_id = req.session.user_id;

  try {
    const drink = await Drink.create({
      ...req.body,
      user: user_id,
    });

    await User.findOneAndUpdate(
      {
        _id: user_id,
      },
      {
        $push: {
          favorites: drink._id,
        },
      }
    );

    res.send(drink);
  } catch (err) {
    res.status(500).send({ error: err });
  }
});

// Delete a drink
router.delete("/drink/:id", isAuthenticated, async (req, res) => {
  const drink_id = req.params.id;

  // Get the drink by id
  const drink = await Drink.findById(drink_id);

  if (!drink)
    return res.status(500).send({ error: "That drink doesn't exist." });

  if (drink.user !== req.session.user_id)
    return res
      .status(401)
      .send({ error: "You are not allowed to delete another user's drink." });

  await Drink.findByIdAndDelete(drink_id);

  res.send({ message: "Drink deleted successfully!" });
});

module.exports = router;
