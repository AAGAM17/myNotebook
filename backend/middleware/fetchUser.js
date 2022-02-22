var jwt = require("jsonwebtoken");
const JWT_SECRET = "Harry";

const fetchuser = (req, res, next) => {
  // Get the user from the JWT Token and add id to req.
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "Please Authenticate Using A Valid Token" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please Authenticate Using A Valid Token" });
  }
};

module.exports = fetchuser;
