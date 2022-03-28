import React, { Component } from 'react';
import '../App.css';
import AppNavbar from '../AppNavbar.js';
import { Link } from 'react-router-dom';
import { Container, Alert } from 'reactstrap';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';

import MePage from './MePage';
import MeJoinedEvents from './MeJoinedEvents';
import MeEventsToJoin from './MeEventsToJoin';
import ErrorNotifier from '../Handler/ErrorNotifier';
import Constants from '../Const/Constants';
import MePhotos from './MePhotos';
import MeChangePresonalData from './MeChangePresonalData';
import MessengerCore from '../Messanger/MessengerCore';

class MyMessenger extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };

    }

    render() {

        if (localStorage.getItem("login") == null
            || !Constants.isAnyRole((localStorage.getItem("role")))
            || localStorage.getItem("id") == null) {
            return <ErrorNotifier />
        }

        return (
            <div>
                <AppNavbar />
                <Container fluid>
                    <MessengerCore />
                </Container>
                <ErrorNotifier />
            </div>
        );
    }
}

export default MyMessenger;