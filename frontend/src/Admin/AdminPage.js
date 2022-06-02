import React, { Component } from 'react';
import '../App.css';
import AppNavbar from '../AppNavbar.js';
import { Link } from 'react-router-dom';
import { Button, Container, Col, Row } from 'react-bootstrap';
import ErrorNotifier from '../Handler/ErrorNotifier';
import style from "../style.css"
import { Card, CardGroup, Alert, ToggleButton } from 'react-bootstrap'
import {dispense} from "Localization/Dispenser.js"

const roleAdmin = "ROLE_ADMIN"

class AdminPage extends Component {
    constructor(props) {
        super(props);

        this.goToEvents = this.goToEvents.bind(this);
        this.goToCategories = this.goToCategories.bind(this);
        this.goToUsers = this.goToUsers.bind(this);
        this.goToProps = this.goToProps.bind(this);
        this.goToPropOrders = this.goToPropOrders.bind(this);
    }

    goToEvents() {
        this.props.history.push('/event-management/events')
    }

    goToCategories() {
        this.props.history.push('/category-management/categories')
    }

    goToUsers() {
        this.props.history.push('/user-management/users')
    }

    goToProps() {
        this.props.history.push('/prop-management/props')
    }

    goToPropOrders() {
        this.props.history.push('/prop-management/propOrders')
    }

    render() {

        if (localStorage.getItem("login") == null || localStorage.getItem("role") !== roleAdmin || localStorage.getItem("id") == null) {
            return <ErrorNotifier />
        }

        return (
            <div>
                <AppNavbar />
                <Container fluid>
                    <div class="adminConsole">
                        <Card onClick={this.goToEvents}>
                            <Card.Img variant="top" style={{minWidth: "100%"}} src={"/party.jpg"} className="mt-0 events" />
                            <Card.Body>
                                <Card.Title>{dispense("events")}</Card.Title>
                                <Card.Text>{dispense("adminEventsDescription")}</Card.Text>
                            </Card.Body>
                        </Card>
                        <Card onClick={this.goToCategories}>
                            <Card.Img variant="top" style={{minWidth: "100%"}} src={"/wordCloud.png"} className="mt-0" />
                            <Card.Body>
                                <Card.Title>{dispense("categories")}</Card.Title>
                                <Card.Text>{dispense("adminCategoriesDescription")}</Card.Text>
                            </Card.Body>
                        </Card>
                        <Card onClick={this.goToUsers}>
                            <Card.Img variant="top" style={{minWidth: "100%"}} src={"/people.jpg"} className="mt-0" />
                            <Card.Body>
                                <Card.Title>{dispense("users")}</Card.Title>
                                <Card.Text>{dispense("adminUsersDescription")}</Card.Text>
                            </Card.Body>
                        </Card>
                        <Card onClick={this.goToProps}>
                            <Card.Img variant="top" style={{minWidth: "100%"}} src={"/props.jpg"} className="mt-0" />
                            <Card.Body>
                                <Card.Title>{dispense("props")}</Card.Title>
                                <Card.Text>{dispense("adminPropsDescription")}</Card.Text>
                            </Card.Body>
                        </Card>
                        <Card onClick={this.goToPropOrders}>
                            <Card.Img variant="top" style={{minWidth: "100%"}} src={"/orders.jpg"} className="mt-0" />
                            <Card.Body>
                                <Card.Title>{dispense("propOrders")}</Card.Title>
                                <Card.Text>{dispense("adminPropOrdersDescription")}</Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                </Container>
            </div>
        );
    }
}

export default AdminPage;