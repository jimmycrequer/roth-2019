import React, {Component} from "react";
import "./App.css";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import gql from "graphql-tag";
import {compose, graphql} from "react-apollo";
import Header from "./Header"

const REGISTER_USER = gql`
  mutation User($userName: String!, $userScore: Int) {
    CreateUser(name: $userName, score: $userScore) {
      id
      score
    }
  }
`;

class NameInputPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      userId: "",
      userScore: 0
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  
  handleChange(event) {
    this.setState({userName: event.target.value});
  }
  
  async regUser(name) {
    const {CreateUser} = this.props;
    const result = await CreateUser({
      variables: {
        userName: name,
        userScore: 0
      }
    });
    /** @namespace result.data.CreateUser */
    this.setState({userId: result.data.CreateUser.id});
    this.setState({userScore: result.data.CreateUser.score});
    this.handleClick();
  }
  
  handleClick() {
    this.props.history.push({
      pathname: "/quiz",
      state: {
        userName: this.state.userName,
        userId: this.state.userId,
        userScore: this.state.userScore
      }
    });
  }
  
  render() {
    return (
      <>
        <Header/>
        <Container>
          <Row className="align-items-center justify-content-center">
            <Col md={6} className="text-center">
              <Form.Control
                type="text"
                placeholder="your name..."
                value={this.state.userName}
                onChange={this.handleChange}
                className="mb-2"
              />
              <Button
                variant="danger"
                type="button"
                onClick={this.regUser.bind(this, this.state.userName)}
                disabled={this.state.userName === ""}
              >
                Next!
              </Button>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default compose(graphql(REGISTER_USER, {name: "CreateUser"}))(
  NameInputPage
);
