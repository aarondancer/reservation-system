const mongoose = require("mongoose");
const Reservation = require('../models/Reservation');

function create(req, res) {
  if (!req.body) {
    res.sendStatus(400);
  }

  return Reservation.create(req.body, (err, reservation) => {
    if (err) {
      res.status(500);
      return res.json(err);
    }

    return res.json(reservation);
  });
}

function find(req, res) {
  const query = Object.assign({}, req.query);

  return Reservation.find(query, (err, reservations) => {
    if (err) {
      res.status(500);
      return res.json(err);
    }

    return res.json(reservations);
  });
}

function findById(req, res) {
  if (!req.params || !req.params.id) {
    res.sendStatus(400);
  }

  return Reservation.findById(req.params.id, (err, reservation) => {
    if (err) {
      res.status(500);
      return res.json(err);
    }

    return res.json(reservation);
  });
}

module.exports = {
  create,
  find,
  findById
};
