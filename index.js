const express = require("express");
const app = express();
const db = require("./models");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(express.json());
app.use(cookieParser());
app.use(cors());

const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);
const messagesRouter = require("./routes/Messages");
app.use("/message", messagesRouter);
const productsRouter = require("./routes/Products");
app.use("/product", productsRouter);
const eventsRouter = require("./routes/Events");
app.use("/event", eventsRouter);
const gatheringsRouter = require("./routes/Gatherings");
app.use("/gathering", gatheringsRouter);

db.sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log("Server is running on port 3001");
  });
});
