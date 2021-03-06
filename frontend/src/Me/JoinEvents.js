import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {Badge, Button} from 'react-bootstrap';
import EventsToJoin from './EventsToJoin';
import {Container} from 'react-bootstrap'
import $ from 'jquery';
import AppNavbar from '../AppNavbar';
import ErrorNotifier from '../Handler/ErrorNotifier';
import Constants from '../Const/Constants';

class JoinEvents extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        if(localStorage.getItem("login") == null 
        || !Constants.isAnyRole((localStorage.getItem("role"))) 
        || localStorage.getItem("id") == null){
            return <ErrorNotifier/>
        }
        return (
            <div>
                <AppNavbar/>
                <Container fluid>
                    <EventsToJoin/>
                </Container>
                <ErrorNotifier/>
            </div>
		);
    }
}

export default withRouter(JoinEvents);