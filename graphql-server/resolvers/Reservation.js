const resolvers = {
  Reservation: {
    id(reservation) {
      return reservation._id;
    },
  },
  Query: {
    reservations(root, { lastCreatedAt, limit }, { Reservation }) {
      return Reservation.all({ lastCreatedAt, limit });
    },

    reservation(root, { id }, { Reservation }) {
      return Reservation.findOneById(id);
    },
  },
  Mutation: {
    async createReservation(root, { input }, { Reservation }) {
      const id = await Reservation.insert(input);
      return Reservation.findOneById(id);
    },

    async updateReservation(root, { id, input }, { Reservation }) {
      await Reservation.updateById(id, input);
      return Reservation.findOneById(id);
    },

    removeReservation(root, { id }, { Reservation }) {
      return Reservation.removeById(id);
    },
  },
  Subscription: {
    reservationCreated: reservation => reservation,
    reservationUpdated: reservation => reservation,
    reservationRemoved: id => id,
  },
};

export default resolvers;
