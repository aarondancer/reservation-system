import React from "react";
import { Container } from "semantic-ui-react";
import withData from "../lib/withData";
import ReservationsList from "../components/ReservationsList";

export default withData(() => (
  <Container style={{ paddingTop: "60px", paddingBottom: "60px" }}>
    <h1>Reservation System</h1>
    <ReservationsList />
  </Container>
));
