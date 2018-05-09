import { Button, Header, Icon, Form, Message, Modal } from "semantic-ui-react";
import { Query } from "react-apollo";
import dayjs from "dayjs";
import { getReservationById } from "../graphql-client/reservations";

const ErrorMessage = ({ error }) => (
  <Message error icon>
    <Icon name="exclamation" />
    <Message.Content>
      <Message.Header>Whoops! Looks like we ran into an issue:</Message.Header>
      {error}
    </Message.Content>
  </Message>
);

export default class ViewReservationModal extends React.Component {
  state = {
    isOpen: false
  };

  openModal = () => this.setState({ isOpen: true });

  closeModal = () => this.setState({ isOpen: false });

  render() {
    const { isOpen } = this.state;

    return (
      <Query
        query={getReservationById}
        variables={{ id: this.props.reservationId }}
      >
        {({ loading, error, data }) => (
          <Modal
            trigger={
              <Button onClick={this.openModal}>
                <Icon name="eye" />View
              </Button>
            }
            closeIcon
            size="tiny"
            open={isOpen}
            onClose={this.closeModal}
          >
            <Modal.Header>Reservation for {(data && data.reservation && data.reservation.name) || 'loading...'}</Modal.Header>
            <Modal.Content>
              {loading && (
                <Message icon>
                  <Icon name="circle notched" loading />
                  <Message.Content>
                    <Message.Header>Just one second</Message.Header>
                    We are fetching your reservation.
                  </Message.Content>
                </Message>
              )}
              {data &&
                data.reservation && (
                  <Form>
                    <Form.Group widths="equal">
                      <Form.Input
                        fluid
                        label="First name"
                        value={data.reservation.name.split(" ")[0]}
                        readOnly
                      />
                      <Form.Input
                        fluid
                        label="Last name"
                        value={data.reservation.name.split(" ")[1]}
                        readOnly
                      />
                    </Form.Group>
                    <Form.Input
                      fluid
                      label="Hotel Name"
                      value={data.reservation.hotelName}
                      readOnly
                    />
                    <Form.Input
                      fluid
                      label="Arrival Date"
                      value={dayjs(data.reservation.arrivalDate).format(
                        "MM/DD/YYYY"
                      )}
                      readOnly
                    />
                    <Form.Input
                      fluid
                      label="Departure Date"
                      value={dayjs(data.reservation.departureDate).format(
                        "MM/DD/YYYY"
                      )}
                      readOnly
                    />
                  </Form>
                )}
            </Modal.Content>
          </Modal>
        )}
      </Query>
    );
  }
}
