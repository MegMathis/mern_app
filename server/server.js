const express = require("express");
const PORT = process.env.PORT || 3333;

const api_routes = require("./routes/api_routes");

const app = express();

app.use(express.static("../client/dist"));

app.use("/api", api_routes);

app.listen(PORT, () => console.log("Server started on port %s", PORT));
