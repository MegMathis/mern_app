require("dotenv").config();
const express = require("express");
const db = require("./config/connection");
const session = require("express-session");
const PORT = process.env.PORT || 3333;

const api_routes = require("./routes/api_routes");
const auth_routes = require("./routes/auth_routes");

const app = express();

app.use(express.static("../client/dist"));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.PORT ? true : false },
  })
);

app.use("/api", api_routes);
app.use("/auth", auth_routes);

db.once("open", () => {
  app.listen(PORT, () => console.log("Server started on port %s", PORT));
});
