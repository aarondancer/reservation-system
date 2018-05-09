import gql from "graphql-tag";

/**
 * Remote GraphQL
 */

export const getReservations = gql`
  query getReservations {
    reservations @rest(type: "Reservation", path: "reservations/") {
      _id
      name
      hotelName
      arrivalDate
      departureDate
    }
  }
`;

export const getReservationById = gql`
  query getReservationById($id: String!) {
    reservation(id: $id) @rest(type: "Reservation", path: "reservations/:id") {
      _id @export(as: "reservationId")
      name
      hotelName
      arrivalDate
      departureDate
    }
  }
`;

export const createReservation = gql`
  fragment ReservationInput on REST {
    name: String
    hotelName: String
    arrivalDate: String
    departureDate: String
  }

  mutation createReservation($input: ReservationInput!) {
    reservation(input: $input)
      @rest(type: "Reservation", path: "reservations/", method: "POST") {
      _id
      name
      hotelName
      arrivalDate
      departureDate
    }
  }
`;
