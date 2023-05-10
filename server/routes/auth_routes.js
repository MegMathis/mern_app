const router = require("express").Router();
const User = require("../models/User");

// http://localhost:3333/auth/register
// register User
router.post("/register", async (req, res) => {
  try {
    const user = await User.create(req.body);

    req.session.user_id = user._id; // logging user in
    res.send(user.select("-password"));
  } catch (err) {
    res.status(402).send({ error: err });
  }
});

// Login User
router.post("/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  //   If no user is found, stop and end an error message
  if (!user)
    return res.status(402).send({ error: "User with that email not found" });

  //   if password does not match, stop and send an error message
  const valid_password = await user.validatePass(req.body.password);

  if (!valid_password)
    return res.status(401).send({ error: "Password does not match" });

  // Log the user in
  req.session.user_id = user._id;

  res.send(user.select("-password"));
});

// log out user
router.get("/logout", (req, res) => {
  req.session.destroy();

  res.send({ message: "User logged out" });
});

// Client side check to see if user is logged in and get their data to
// use on the front end
router.get("/authenticated", async (req, res) => {
  const user_id = req.session.user_id;

  if (!user_id) return res.send({ user: null });

  const user = await User.findById(user_id).populate("favorites");

  res.send({ user: user.select("-password") });
});

module.exports = router;
