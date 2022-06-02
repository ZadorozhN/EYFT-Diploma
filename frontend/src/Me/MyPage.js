import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Container, Button, Card, Col, Row } from 'react-bootstrap'
import { Input } from 'reactstrap';
import AppNavbar from '../AppNavbar';
import $ from 'jquery';
import ErrorHandler from '../Handler/ErrorHandler';
import ErrorNotifier from '../Handler/ErrorNotifier';
import Constants from '../Const/Constants';
import style from "../style.css"
import { dispense } from "Localization/Dispenser";

const address = ""

let thisObj;
const roleAdmin = "ROLE_ADMIN"

class MyPage extends Component {
    constructor(props) {
        super(props);

        this.goToEvents = this.goToEvents.bind(this);
        this.goToJoinedEvents = this.goToJoinedEvents.bind(this);
        this.goToMessenger = this.goToMessenger.bind(this);
        this.goToPhotos = this.goToPhotos.bind(this);
        this.goToSettings = this.goToSettings.bind(this);
    }

    goToEvents() {
        this.props.history.push('/me/events')
    }
    
    goToJoinedEvents() {
        this.props.history.push('/me/joined')
    }

    goToMessenger() {
        this.props.history.push('/me/messenger')
    }
    
    goToPhotos() {
        this.props.history.push('/me/photos')
    }

    goToSettings() {
        this.props.history.push('/me/settings')
    }

    render() {

        if(localStorage.getItem("login") == null 
        || !Constants.isAnyRole((localStorage.getItem("role"))) 
        || localStorage.getItem("id") == null){
            return <ErrorNotifier/>
        }

        return (
            <div>
                <AppNavbar />
                <Container fluid>
                    <div class="adminConsole">
                        <Card onClick={this.goToEvents}>
                            <Card.Img variant="top" src={"/eventsLotr.webp"} className="mt-0" />
                            <Card.Body>
                                <Card.Title>{dispense("events")}</Card.Title>
                                <Card.Text>{dispense("userEventsDescription")}</Card.Text>
                            </Card.Body>
                        </Card>
                        <Card onClick={this.goToJoinedEvents}>
                            <Card.Img variant="top" src={"/joinedEvents.webp"} className="mt-0" />
                            <Card.Body>
                                <Card.Title>{dispense("participationInEvents")}</Card.Title>
                                <Card.Text>{dispense("userParticipationInEventsDescription")}</Card.Text>
                            </Card.Body>
                        </Card>
                        <Card onClick={this.goToMessenger}>
                            <Card.Img variant="top" src={"/talks.jpg"} className="mt-0" />
                            <Card.Body>
                                <Card.Title>{dispense("messenger")}</Card.Title>
                                <Card.Text>{dispense("userMessengerDescription")}</Card.Text>
                            </Card.Body>
                        </Card>
                        <Card onClick={this.goToPhotos}>
                            <Card.Img variant="top" src={"/photos.jpg"} className="mt-0" />
                            <Card.Body>
                                <Card.Title>{dispense("photos")}</Card.Title>
                                <Card.Text>{dispense("userPhotosDescription")}</Card.Text>
                            </Card.Body>
                        </Card>
                        <Card onClick={this.goToSettings}>
                            <Card.Img variant="top" src={"/gears.jpg"} className="mt-0" />
                            <Card.Body>
                                <Card.Title>{dispense("settings")}</Card.Title>
                                <Card.Text>{dispense("userSettingsDescription")}</Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                </Container>
            </div>
        );
    }
}

export default withRouter(MyPage);