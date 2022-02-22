/* eslint-disable no-undef */
const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "Harry";

// Route1: Create a User Using POST "/api/auth/createuser". No Auth Required
router.post(
  "/createuser",
  [
    body("name", "Enter A Valid Name").isLength({ min: 3 }),
    body("email", "Enter A Valid Email").isEmail(),
    body("password", "Enter A Valid Password Min Length 5").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    // Error For Bad Request And Showing Toast.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Check wheater email exists already.
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry A User With This E-Mail already exists." });
      }
      const salt = await bcrypt.genSalt(10);
      securePass = await bcrypt.hash(req.body.password, salt);
      // Create a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);

      res.json(authtoken);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Route2: Login a User Using POST "/api/auth/login". No Login Required
router.post(
  "/login",
  [
    body("email", "Enter A Valid Email").isEmail(),
    body("password", "Password Cannot be Blank").exists(),
  ],
  async (req, res) => {
    // Error For Bad Request And Showing Toast.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please Try To Login With Correct Credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "Please Try To Login With Correct Credentials" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({ authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Route3: Get Loggedin User Details Using POST "/api/auth/getuser". Login Required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = router;
