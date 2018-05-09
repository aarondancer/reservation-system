import React from "react";
import { Query } from "react-apollo";
import { Button, Icon, Message, Table, TableCell } from "semantic-ui-react";
import AddReservationModal from "./AddReservationModal";
import ViewReservationModal from "./ViewReservationModal";
import { getReservations } from "../graphql-client/reservations";

const LoadingMessage = () => (
  <Table.Row>
    <Table.Cell>
      <Message icon>
        <Icon name="circle notched" loading />
        <Message.Content>
          <Message.Header>Just one second</Message.Header>
          We are fetching the reservations.
        </Message.Content>
      </Message>
    </Table.Cell>
  </Table.Row>
);

const ErrorMessage = ({ error }) => {
  console.error(error);
  return (
    <Table.Row>
      <Table.Cell>
        <Message error icon>
          <Icon name="exclamation" />
          <Message.Content>
            <Message.Header>Whoops! We hit an error</Message.Header>
            Looks like something didn't work as planned. Please try again later.
          </Message.Content>
        </Message>
      </Table.Cell>
    </Table.Row>
  );
};

const ReservationsList = () => (
  <Query query={getReservations}>
    {({ loading, error, data: { reservations } }) => {
      return (
        <>
          <AddReservationModal />
          <Table celled>
            <Table.Header>
              <Table.Row>
                {loading ? (
                  <Table.HeaderCell>
                    Loading Reservation Data...
                  </Table.HeaderCell>
                ) : (
                  <>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Hotel</Table.HeaderCell>
                    <Table.HeaderCell>Arrival Date</Table.HeaderCell>
                    <Table.HeaderCell>Departure Date</Table.HeaderCell>
                    <Table.HeaderCell>Actions</Table.HeaderCell>
                  </>
                )}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {loading && <LoadingMessage />}
              {error && <ErrorMessage error={error} />}
              {reservations &&
                (reservations.length === 0 ? (
                  <Table.Row>There are no reservations</Table.Row>
                ) : (
                  reservations.map(reservation => (
                    <Table.Row key={reservation._id}>
                      <Table.Cell>{reservation.name}</Table.Cell>
                      <Table.Cell>{reservation.hotelName}</Table.Cell>
                      <Table.Cell>
                        {new Date(reservation.arrivalDate).toLocaleDateString()}
                      </Table.Cell>
                      <TableCell>
                        {new Date(
                          reservation.departureDate
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <ViewReservationModal reservationId={reservation._id} />
                      </TableCell>
                    </Table.Row>
                  ))
                ))}
            </Table.Body>
          </Table>
        </>
      );
    }}
  </Query>
);

export default ReservationsList;
