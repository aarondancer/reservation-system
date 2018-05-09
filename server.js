const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { graphqlExpress, graphiqlExpress } = require("apollo-server-express");
const next = require("next");
require("dotenv").config();

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const ReservationController = require("./api/controllers/Reservation");
// const schema = require("./api/graphql/schema");

app.prepare().then(() => {
  const server = express();

  mongoose.connect(process.env.DB || "mongodb://127.0.0.1/reservation_system");
  mongoose.Promise = global.Promise;
  mongoose.connection.on(
    "error",
    console.error.bind(console, "MongoDB connection error:")
  );

  server.use(bodyParser.json());

  // Allows for cross origin domain request:
  server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  // graphQLServer.use("/graphql", bodyParser.json(), graphqlExpress({ schema }));
  // graphQLServer.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

  server.get("/api/reservations", ReservationController.find);
  server.get("/api/reservations/:id", ReservationController.findById);
  server.post("/api/reservations", ReservationController.create);

  server.all("/api/*", (req, res) => res.sendStatus(404));

  server.get("*", (req, res) => handle(req, res));

  server.listen(process.env.port || 3000, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${process.env.port || 3000}`);
  });
});
