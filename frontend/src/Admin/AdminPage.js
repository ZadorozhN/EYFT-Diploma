import React, { Component } from 'react';
import '../App.css';
import AppNavbar from '../AppNavbar.js';
import { Link } from 'react-router-dom';
import { Button, Container, Col, Row } from 'react-bootstrap';
import ErrorNotifier from '../Handler/ErrorNotifier';
import style from "../style.css"
import { Card, CardGroup, Alert, ToggleButton } from 'react-bootstrap'


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
                                <Card.Title>Events</Card.Title>
                                <Card.Text>A section where you can administrate events</Card.Text>
                                {/* <Button variant="outline-success" onClick={this.goToEvents} style={{minWidth: "100%"}}>
                                    Events
                                </Button> */}
                            </Card.Body>
                        </Card>
                        <Card onClick={this.goToCategories}>
                            <Card.Img variant="top" style={{minWidth: "100%"}} src={"/wordCloud.png"} className="mt-0" />
                            <Card.Body>
                                <Card.Title>Categories</Card.Title>
                                <Card.Text>Want to add a category? Here we go!</Card.Text>
                                {/* <Button variant="outline-success" onClick={this.goToCategories} style={{minWidth: "100%"}}>
                                    Categories
                                </Button> */}
                            </Card.Body>
                        </Card>
                        <Card onClick={this.goToUsers}>
                            <Card.Img variant="top" style={{minWidth: "100%"}} src={"/people.jpg"} className="mt-0" />
                            <Card.Body>
                                <Card.Title>Users</Card.Title>
                                <Card.Text>Did you really think that you would not find it here? Eh?</Card.Text>
                                {/* <Button variant="outline-success" onClick={this.goToUsers} style={{minWidth: "100%"}}>
                                    Users
                                </Button> */}
                            </Card.Body>
                        </Card>
                        <Card onClick={this.goToProps}>
                            <Card.Img variant="top" style={{minWidth: "100%"}} src={"/props.jpg"} className="mt-0" />
                            <Card.Body>
                                <Card.Title>Props</Card.Title>
                                <Card.Text>Props, Stormtroopers, Paratroopers so on and so on...</Card.Text>
                                {/* <Button variant="outline-success" onClick={this.goToProps} style={{minWidth: "100%"}}>
                                    Props
                                </Button> */}
                            </Card.Body>
                        </Card>
                        <Card onClick={this.goToPropOrders}>
                            <Card.Img variant="top" style={{minWidth: "100%"}} src={"/orders.jpg"} className="mt-0" />
                            <Card.Body>
                                <Card.Title>Prop Orders</Card.Title>
                                <Card.Text>Smooth routine is going to be here</Card.Text>
                                {/* <Button variant="outline-success" onClick={this.goToProps} style={{minWidth: "100%"}}>
                                    Props
                                </Button> */}
                            </Card.Body>
                        </Card>
                    </div>
                </Container>
            </div>
        );
    }
}

export default AdminPage;