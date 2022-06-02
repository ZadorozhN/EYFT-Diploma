import React, { Component } from 'react';
import '../App.css';
import AppNavbar from '../AppNavbar.js';
import { Container, Alert } from 'reactstrap';

import ErrorNotifier from '../Handler/ErrorNotifier';
import Constants from '../Const/Constants';
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