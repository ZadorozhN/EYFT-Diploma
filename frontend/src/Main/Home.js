import React, { Component } from 'react';
import '../App.css';
import AppNavbar from '../AppNavbar.js';
import { Link } from 'react-router-dom';
import { Button, Container } from 'reactstrap';
import AllEventsBlock from './AllEventsBlock';
import ErrorNotifier from '../Handler/ErrorNotifier';

class Home extends Component {
  render() {
    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <AllEventsBlock/>
        </Container>
        <ErrorNotifier/>
      </div>
    );
  }
}

export default Home;