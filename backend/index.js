const connectToMongo = require("./db");
const express = require("express");
var cors = require('cors')

connectToMongo();
const app = express();
const port = 5001;

app.use(cors())
app.use(express.json());

//Available Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.get("/", (req, res) => {
  res.send("Hello Note!");
});

app.listen(port, () => {
  console.log(`myNoteBook Backend listening on port http://localhost:${port}`);
});
