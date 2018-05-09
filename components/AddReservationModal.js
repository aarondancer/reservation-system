import { Button, Header, Icon, Form, Message, Modal } from "semantic-ui-react";
import { Mutation } from "react-apollo";
import {
  createReservation as createReservationMutation,
  getReservations
} from "../graphql-client/reservations";

const ErrorMessage = ({ error }) => (
  <Message error icon>
    <Icon name="exclamation" />
    <Message.Content>
      <Message.Header>Whoops! Looks like we ran into an issue:</Message.Header>
      {error}
    </Message.Content>
  </Message>
);

const ValidationMessage = ({ errors }) => (
  <Message error icon>
    <Icon name="exclamation" />
    <Message.Content>
      <Message.Header>Please fix the following form issues:</Message.Header>
      <ul>{errors.map(err => <li key={err}>{err}</li>)}</ul>
    </Message.Content>
  </Message>
);

export default class AddReservationModal extends React.Component {
  state = {
    input: {},
    errors: [],
    isOpen: false
  };

  handleInput = name => e =>
    this.setState({
      input: {
        ...this.state.input,
        [name]: e.target.value
      }
    });

  validate = () => {
    const { input } = this.state;
    const errors = [];
    if (
      !input.firstName ||
      !input.lastName ||
      input.firstName === "" ||
      input.lastName === ""
    ) {
      errors.push("First and Last Name are required");
    }
    if (!input.hotelName || input.hotelName === "") {
      errors.push("Hotel name is required");
    }
    if (
      !input.arrivalDate ||
      !input.departureDate ||
      input.arrivalDate >= input.departureDate
    ) {
      console.log(input.arrivalDate);
      errors.push("Arrival Date must be before Departure Date");
    }
    this.setState({ errors });
    return errors.length === 0;
  };

  submit = createReservation => () => {
    if (this.validate()) {
      const {
        input: { firstName, lastName, arrivalDate, departureDate, ...rest }
      } = this.state;

      createReservation({
        variables: {
          input: {
            name: `${firstName} ${lastName}`,
            arrivalDate: new Date(arrivalDate).toISOString(),
            departureDate: new Date(departureDate).toISOString(),
            ...rest
          }
        }
      }).then(
        ({ data }) => data.reservation && this.closeModal()
      );
    }
  };

  openModal = () => this.setState({ isOpen: true });

  closeModal = () => this.setState({ isOpen: false });

  render() {
    const { isOpen, errors } = this.state;

    return (
      <Mutation
        mutation={createReservationMutation}
        refetchQueries={[{ query: getReservations }]}
      >
        {(createReservation, { loading, error }) => (
          <Modal
            trigger={
              <Button primary onClick={this.openModal}>
                <Icon name="plus" />Add Reservation
              </Button>
            }
            closeIcon
            size="tiny"
            open={isOpen}
            onClose={this.closeModal}
          >
            <Modal.Header>Add a New Reservation</Modal.Header>
            <Modal.Content>
              {error && <ErrorMessage error={error} />}
              {errors.length > 0 && <ValidationMessage errors={errors} />}
              <Form>
                <Form.Group widths="equal">
                  <Form.Input
                    fluid
                    label="First name"
                    placeholder="First name"
                    required
                    onChange={this.handleInput("firstName")}
                  />
                  <Form.Input
                    fluid
                    label="Last name"
                    placeholder="Last name"
                    onChange={this.handleInput("lastName")}
                    required
                  />
                </Form.Group>
                <Form.Input
                  fluid
                  label="Hotel Name"
                  placeholder="Hotel name"
                  onChange={this.handleInput("hotelName")}
                  required
                />
                <Form.Input
                  fluid
                  type="date"
                  label="Arrival Date"
                  onChange={this.handleInput("arrivalDate")}
                  required
                />
                <Form.Input
                  fluid
                  type="date"
                  label="Departure Date"
                  onChange={this.handleInput("departureDate")}
                  required
                />
              </Form>
            </Modal.Content>
            <Modal.Actions>
              <Button
                primary
                onClick={this.submit(createReservation)}
                loading={loading}
                disable={loading.toString()}
              >
                <Icon name="check" />Add Reservation
              </Button>
            </Modal.Actions>
          </Modal>
        )}
      </Mutation>
    );
  }
}
