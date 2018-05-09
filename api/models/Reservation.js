const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reservationSchema = new Schema({
  name: {
    type: String,
    required: [
      true,
      "Please enter the name of the person the reservation is for."
    ],
    minlength: 3,
    validate: {
      validator: input => input.includes(" "),
      message: "Please enter both a first and last name."
    }
  },
  hotelName: {
    type: String,
    minLength: 3,
    required: [
      true,
      "Please enter the name of the hotel that the reservation is for."
    ]
  },
  arrivalDate: {
    type: Date,
    required: [true, "Please enter the date that the guest will check in on."],
    validate: {
      validator: function(input) {
        return input <= this.departureDate;
      },
      message:
        "The date of arrival should be earlier than the date of departure."
    }
  },
  departureDate: {
    type: Date,
    required: [true, "Please enter the date that the guest will check out on."],
    validate: {
      validator: function(input) {
        return input >= this.arrivalDate;
      },
      message: "The date of departure should be later than the date of arrival."
    }
  }
});

module.exports = mongoose.model(
  "reservation",
  reservationSchema,
  "reservation"
);
